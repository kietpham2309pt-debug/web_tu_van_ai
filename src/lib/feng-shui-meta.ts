/**
 * Map nhẹ tiếng Anh dùng nhúng vào prompt AI (client-safe, không kéo dữ liệu nạp âm 60 năm).
 */
export type Element = "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho";

export const META_FOR_PROMPT: Record<Element, string> = {
  Kim: "color palette dominated by pure white, polished stainless steel, soft grey, and matte silver accents; clean linear cabinetry; marble or quartz countertop with subtle veining",
  Moc: "color palette of light oak wood, sage green, and deep forest green accents; visible wood grain on cabinets; potted herbs on the counter near the window; abundant natural daylight",
  Thuy: "color palette of deep navy blue and matte black cabinets with brushed nickel handles; black quartz countertop with white veining; subtle silver accents; moody ambient lighting",
  Hoa: "color palette of warm terracotta, burgundy red accents, and walnut wood cabinets; brass and copper hardware; warm tungsten pendant lights; cozy inviting atmosphere",
  Tho: "color palette of warm beige, sand, and earthy yellow tones; travertine or terrazzo countertop; oak cabinets in natural finish; soft warm sunset lighting from a window",
};
