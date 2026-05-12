"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#1c1917",
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#a16207",
    borderBottomStyle: "solid",
  },
  logoBox: { width: 120 },
  logo: { width: 110, height: 36, objectFit: "contain" },
  companyBlock: { fontSize: 9, color: "#57534e", textAlign: "right" },
  companyName: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1c1917",
    marginBottom: 2,
    textAlign: "right",
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#57534e",
    marginBottom: 14,
  },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#92400e",
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    borderBottomStyle: "solid",
  },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 105, color: "#57534e", fontSize: 9 },
  value: { flex: 1, fontWeight: 700, fontSize: 10 },
  imageBox: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderStyle: "solid",
    borderRadius: 4,
    padding: 5,
  },
  productImage: { width: "100%", height: 250, objectFit: "cover" },
  imageNote: {
    fontSize: 8,
    color: "#78716c",
    marginTop: 4,
    fontStyle: "italic",
    textAlign: "center",
  },
  table: { marginVertical: 6 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: 700,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e7e5e4",
    borderBottomStyle: "solid",
    fontSize: 9,
  },
  colSTT: { width: 24, textAlign: "center" },
  colName: { flex: 1, paddingRight: 4 },
  colSKU: { width: 70, fontSize: 8, color: "#78716c" },
  colQty: { width: 30, textAlign: "center" },
  colPrice: { width: 75, textAlign: "right" },
  colTotal: { width: 85, textAlign: "right", fontWeight: 700 },
  totalsBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1c1917",
    borderTopStyle: "solid",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 1,
  },
  totalLabel: {
    width: 160,
    textAlign: "right",
    paddingRight: 12,
    fontSize: 9,
    color: "#57534e",
  },
  totalValue: { width: 85, textAlign: "right", fontSize: 10 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#1c1917",
    borderTopStyle: "solid",
  },
  grandTotalLabel: {
    width: 160,
    textAlign: "right",
    paddingRight: 12,
    fontWeight: 700,
    fontSize: 11,
    color: "#1c1917",
  },
  grandTotalValue: {
    width: 85,
    textAlign: "right",
    fontWeight: 700,
    fontSize: 11,
    color: "#a16207",
  },
  termItem: { fontSize: 9, marginBottom: 5, paddingLeft: 6 },
  sigBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  sigBox: { width: "45%", alignItems: "center" },
  sigTitle: { fontWeight: 700, fontSize: 10, marginBottom: 3 },
  sigSubtitle: {
    fontSize: 8,
    color: "#78716c",
    marginBottom: 55,
    textAlign: "center",
  },
  sigLine: {
    borderTopWidth: 0.5,
    borderTopColor: "#1c1917",
    borderTopStyle: "solid",
    width: "100%",
    paddingTop: 4,
    alignItems: "center",
  },
  sigCaption: { fontSize: 8, color: "#78716c" },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    fontSize: 7,
    color: "#a8a29e",
    textAlign: "center",
  },
});

export type ContractItem = {
  name: string;
  sku: string;
  qty: number;
  price: number;
};

export type ContractData = {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    note?: string;
  };
  order: {
    code: string;
    date: string;
    scenarioId: string;
    scenarioTitle: string;
    tier: string;
    tierLabel: string;
    layout: string;
    style: string;
    element?: string;
  };
  imageDataUrl: string;
  items: ContractItem[];
  fees: {
    install: number;
    shipping: number;
    discount: number;
  };
  logoUrl?: string;
};

function fmt(vnd: number) {
  if (!vnd || vnd <= 0) return "0 ₫";
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

export function ContractPDF({ data }: { data: ContractData }) {
  const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0);
  const total =
    subtotal + data.fees.install + data.fees.shipping - data.fees.discount;

  return (
    <Document
      title={`Biên bản đơn hàng ${data.order.code}`}
      author="Bếp Ngọc Bảo"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.logoBox}>
            {data.logoUrl && <Image src={data.logoUrl} style={styles.logo} />}
          </View>
          <View>
            <Text style={styles.companyName}>BẾP NGỌC BẢO — BNB</Text>
            <Text style={styles.companyBlock}>Công ty TNHH K-Homès</Text>
            <Text style={styles.companyBlock}>
              62 Bạch Đằng, P.14, Q.Bình Thạnh, TP.HCM
            </Text>
            <Text style={styles.companyBlock}>Hotline: 0867 450 198</Text>
            <Text style={styles.companyBlock}>Email: op.dept@peaki.vn</Text>
          </View>
        </View>

        <Text style={styles.title}>Biên bản xác nhận đơn hàng căn bếp</Text>
        <Text style={styles.subtitle}>
          Mã đơn: {data.order.code}  ·  Ngày lập: {data.order.date}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. THÔNG TIN BÊN MUA</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Họ tên:</Text>
            <Text style={styles.value}>{data.customer.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{data.customer.phone}</Text>
          </View>
          {data.customer.email ? (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{data.customer.email}</Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.label}>Địa chỉ giao:</Text>
            <Text style={styles.value}>{data.customer.address}</Text>
          </View>
          {data.customer.note ? (
            <View style={styles.row}>
              <Text style={styles.label}>Ghi chú:</Text>
              <Text style={styles.value}>{data.customer.note}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. THÔNG TIN ĐƠN HÀNG</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Kịch bản combo:</Text>
            <Text style={styles.value}>
              {data.order.scenarioId} — {data.order.scenarioTitle}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cấp combo:</Text>
            <Text style={styles.value}>
              {data.order.tier} — {data.order.tierLabel}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bố cục bếp:</Text>
            <Text style={styles.value}>{data.order.layout}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phong cách:</Text>
            <Text style={styles.value}>{data.order.style}</Text>
          </View>
          {data.order.element ? (
            <View style={styles.row}>
              <Text style={styles.label}>Mệnh phong thuỷ:</Text>
              <Text style={styles.value}>{data.order.element}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. MẪU THIẾT KẾ ĐÃ CHỌN</Text>
          <View style={styles.imageBox}>
            <Image src={data.imageDataUrl} style={styles.productImage} />
          </View>
          <Text style={styles.imageNote}>
            Ảnh AI minh hoạ. Bản thực tế thi công có thể khác do điều kiện
            không gian, ánh sáng và chất liệu thực tế.
          </Text>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Mã đơn: ${data.order.code}  ·  Trang ${pageNumber}/${totalPages}`
          }
          fixed
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. CHI TIẾT THIẾT BỊ</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader} fixed>
              <Text style={styles.colSTT}>STT</Text>
              <Text style={styles.colName}>Sản phẩm</Text>
              <Text style={styles.colSKU}>SKU</Text>
              <Text style={styles.colQty}>SL</Text>
              <Text style={styles.colPrice}>Đơn giá</Text>
              <Text style={styles.colTotal}>Thành tiền</Text>
            </View>
            {data.items.map((it, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <Text style={styles.colSTT}>{idx + 1}</Text>
                <Text style={styles.colName}>{it.name}</Text>
                <Text style={styles.colSKU}>{it.sku || "—"}</Text>
                <Text style={styles.colQty}>{it.qty}</Text>
                <Text style={styles.colPrice}>{fmt(it.price)}</Text>
                <Text style={styles.colTotal}>{fmt(it.price * it.qty)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng tiền hàng:</Text>
              <Text style={styles.totalValue}>{fmt(subtotal)}</Text>
            </View>
            {data.fees.install > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Phí lắp đặt:</Text>
                <Text style={styles.totalValue}>{fmt(data.fees.install)}</Text>
              </View>
            ) : null}
            {data.fees.shipping > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
                <Text style={styles.totalValue}>{fmt(data.fees.shipping)}</Text>
              </View>
            ) : null}
            {data.fees.discount > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Giảm giá:</Text>
                <Text style={styles.totalValue}>
                  -{fmt(data.fees.discount)}
                </Text>
              </View>
            ) : null}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TỔNG THANH TOÁN:</Text>
              <Text style={styles.grandTotalValue}>{fmt(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>V. ĐIỀU KHOẢN & CAM KẾT</Text>
          <Text style={styles.termItem}>
            1. Khách hàng xác nhận đã xem và đồng ý với mẫu thiết kế AI cùng
            danh sách thiết bị được liệt kê trong biên bản này.
          </Text>
          <Text style={styles.termItem}>
            2. Khách đặt cọc tối thiểu 30% giá trị đơn hàng khi ký biên bản.
            Phần còn lại thanh toán khi nhận hàng đầy đủ và lắp đặt hoàn tất.
          </Text>
          <Text style={styles.termItem}>
            3. Đơn hàng không được hoàn trả hoặc đổi sau khi BNB đã đặt hàng
            với nhà cung cấp (trừ trường hợp lỗi do BNB hoặc nhà sản xuất).
          </Text>
          <Text style={styles.termItem}>
            4. Bảo hành theo chính sách của hãng kèm 12 tháng dịch vụ lắp đặt
            từ BNB. Bảo trì miễn phí trong 6 tháng đầu kể từ ngày lắp đặt.
          </Text>
          <Text style={styles.termItem}>
            5. Mọi tranh chấp được giải quyết thông qua thương lượng trước.
            Trường hợp không thoả thuận được sẽ được giải quyết tại Toà án
            Nhân dân TP. Hồ Chí Minh theo quy định của pháp luật Việt Nam.
          </Text>
        </View>

        <View style={styles.sigBlock} wrap={false}>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>BÊN BÁN</Text>
            <Text style={styles.sigSubtitle}>
              Công ty TNHH K-Homès{"\n"}(Bếp Ngọc Bảo)
            </Text>
            <View style={styles.sigLine}>
              <Text style={styles.sigCaption}>
                (Ký, ghi rõ họ tên & đóng dấu)
              </Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>BÊN MUA</Text>
            <Text style={styles.sigSubtitle}>
              {data.customer.name}
              {"\n"}
              {data.customer.phone}
            </Text>
            <View style={styles.sigLine}>
              <Text style={styles.sigCaption}>(Ký, ghi rõ họ tên)</Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Mã đơn: ${data.order.code}  ·  Trang ${pageNumber}/${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
