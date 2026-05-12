export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bepngocbao.vn";
export const SITE_NAME = "Bếp Ngọc Bảo";
export const SITE_TAGLINE = "Mua bếp đúng ngay lần đầu";
export const SITE_DESCRIPTION =
  "Showroom đa thương hiệu cao cấp BNB — tư vấn AI, demo bếp bằng AI và tra cứu 1.700+ sản phẩm Bosch, Spelier, Kocher, Konox. Bảo hành chính hãng, lắp đặt tận nơi.";

export const SHOP_PHONE = "0867 450 198";
export const SHOP_ADDRESS = "62 Bạch Đằng, Phường 14, Q. Bình Thạnh, TP. Hồ Chí Minh";
export const SHOP_EMAIL = "op.dept@peaki.vn";

/** Site bán hàng chính (Haravan) — tất cả link sản phẩm trỏ về đây */
export const BNB_SHOP_URL = "https://bepngocbao.vn";
export const BNB_LOGO = "https://cdn.hstatic.net/themes/200001107558/1001482189/14/logo.png?v=13";
export const BNB_FAVICON = "https://cdn.hstatic.net/themes/200001107558/1001482189/14/favicon.png?v=13";

/** URL trang chi tiết sản phẩm trên Haravan của BNB */
export function bnbProductUrl(slug: string): string {
  return `${BNB_SHOP_URL}/products/${slug}`;
}

/** URL collection (danh mục) trên Haravan của BNB */
export function bnbCollectionUrl(slug: string = "all"): string {
  return `${BNB_SHOP_URL}/collections/${slug}`;
}
