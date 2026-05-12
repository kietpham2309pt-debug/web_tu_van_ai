import { SCENARIOS } from "@/data/scenarios";
import type { Scenario, WizardAnswers } from "@/types";
import { budgetRange } from "./utils";

/**
 * Map (loại nhà × ngân sách × ưu tiên) → kịch bản phù hợp nhất theo playbook BNB.
 * Cho điểm từng kịch bản và trả về top match.
 */
export function matchScenarios(answers: WizardAnswers): { best: Scenario; alternatives: Scenario[] } {
  const [bmin, bmax] = budgetRange(answers.budget);
  const houseType = answers.houseType ?? "chung-cu";
  const priority = answers.priority ?? "can-bang";

  const scored = SCENARIOS.map((s) => {
    let score = 0;

    // House type match
    if (s.filters.houseTypes.includes("any")) score += 1;
    else if (s.filters.houseTypes.includes(houseType)) score += 4;

    // Budget overlap
    const overlap = Math.max(0, Math.min(bmax, s.filters.budgetMax) - Math.max(bmin, s.filters.budgetMin));
    const userRange = Math.max(1, bmax - bmin);
    score += (overlap / userRange) * 5;

    // Priority match
    if (s.filters.priorities.includes(priority)) score += 3;
    if (s.filters.priorities.includes("any")) score += 1;

    // Bonus cho kịch bản đặc thù khi cooking style là nuong-banh
    if (answers.cookingStyle === "nuong-banh" && s.id === "KB-09") score += 5;

    // Bonus cho cải tạo bếp cũ
    if (answers.status === "cai-tao" && s.id === "KB-10") score += 5;

    return { scenario: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    best: scored[0].scenario,
    alternatives: scored.slice(1, 4).map((x) => x.scenario),
  };
}
