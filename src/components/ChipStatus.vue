<template>
  <v-chip :color="color" :text-color="textColor" :small="sub">
    <v-icon left :small="sub">{{ icon }}</v-icon>
    {{ text }}
  </v-chip>
</template>

<script lang="ts">
interface Matching {
  en: string;
  vi: string;
  color: string;
  icon?: string;
  textColor?: string;
}

import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class ChipStatus extends Vue {
  @Prop() status!: string;
  @Prop() type!: string;
  @Prop() sub!: boolean;

  color = "primary";
  text = "Pending";
  textColor = "white";
  icon = "";
  listMatch = [] as Matching[];

  statusMatching = [
    // PENDING
    { en: "BIDDING", vi: "Đang đấu thầu", color: "primary" },
    { en: "PENDING", vi: "Đang chờ", color: "primary" },
    { en: "SHIPPING", vi: "Đang vận chuyển", color: "primary" },
    { en: "CREATED", vi: "Đã tạo", color: "primary" },
    // INFO
    { en: "INFO_RECEIVED", vi: "Đã nhận thông tin", color: "info" },
    { en: "UPDATED", vi: "Cập nhật", color: "info" },
    // SUCCESS
    { en: "ACCEPTED", vi: "Đã đồng ý", color: "success" },
    { en: "ACTIVE", vi: "Đang hoạt động", color: "success" },
    { en: "COMBINED", vi: "Đã ghép", color: "success" },
    { en: "DELIVERED", vi: "Đã giao", color: "success" },
    { en: "RESOLVED", vi: "Đã giải quyết", color: "success" },
    { en: "PAID", vi: "Đã thanh toán", color: "success" },
    // WARNING
    { en: "CANCELED", vi: "Đã hủy", color: "warning" },
    { en: "CANCEL", vi: "Đã hủy", color: "warning" },
    // ERROR
    { en: "REJECTED", vi: "Từ chối", color: "error" },
    { en: "BANNED", vi: "Cấm", color: "error" },
    { en: "EXCEPTION", vi: "Có lỗi", color: "error" },
    // EXPIRED
    { en: "EXPIRED", vi: "Hết hạn", color: "gray", textColor: "black" },
    { en: "CLOSED", vi: "Đã đóng", color: "gray", textColor: "black" }
  ] as Matching[];

  typeMatching = [
    // PENDING
    {
      en: "REPORT",
      vi: "Báo cáo vấn đề",
      color: "warning",
      icon: "report_problem"
    },
    { en: "CONTRACT", vi: "Hợp đồng", color: "info", icon: "attach_file" },
    {
      en: "BIDDING",
      vi: "Đấu thầu",
      color: "primary",
      icon: "monetization_on"
    },
    {
      en: "SHIPPINGLINE",
      vi: "Mượn vỏ",
      color: "success",
      icon: "directions_boat"
    },
    { en: "DRIVER", vi: "Giao việc", color: "success", icon: "local_shipping" }
  ] as Matching[];

  actionMatching = [
    // BIDDING
    { en: "BIDDING_INVITED", vi: "Nhận HSMT", color: "primary" },
    { en: "BIDDING_EDITED", vi: "Sửa HSMT", color: "warning" },
    { en: "BIDDING_CANCELED", vi: "Hủy HSMT", color: "error" },
    { en: "BID_ADDED", vi: "Gửi HSDT", color: "primary" },
    { en: "BID_EDITED", vi: "Sửa HSDT", color: "warning" },
    { en: "BID_REJECTED", vi: "Từ chối HSDT", color: "error" },
    { en: "BID_ACCEPTED", vi: "Đồng ý HSDT", color: "success" },
    { en: "CONTRACT_ADD", vi: "Nhận Hợp đồng", color: "primary" },
    { en: "CONTRACT_EDITED", vi: "Sửa Hợp đồng", color: "warning" },
    { en: "CONTRACT_ACCEPTED", vi: "Đồng ý hợp đồng", color: "success" },
    { en: "CONTRACT_REJECTED", vi: "Từ chối hợp đồng", color: "error" },
    // REPORT
    { en: "NEW", vi: "Mới", color: "primary" },
    { en: "FEEDBACK", vi: "Phản hồi", color: "info" },
    { en: "UPDATED", vi: "Cập nhật", color: "warning" },
    { en: "REJECTED", vi: "Từ chối giải quyết", color: "error" },
    { en: "ACCEPTED", vi: "Đã giải quyết", color: "success" },
    { en: "CLOSED", vi: "Đóng", color: "gray", textColor: "black" },
    // DRIVER + SHIPPINGLINE
    { en: "TASK", vi: "Giao việc", color: "primary" },
    { en: "CANCEL", vi: "Hủy yêu cầu", color: "error" }
  ] as Matching[];

  created() {
    switch (this.type) {
      case "status":
        this.listMatch = this.statusMatching;
        break;
      case "type":
        this.listMatch = this.typeMatching;
        break;
      case "action":
        this.listMatch = this.actionMatching;
        break;
      default:
        this.listMatch = this.statusMatching;
        break;
    }
    const _status = this.listMatch.filter(x => x.en == this.status)[0];
    if (_status) {
      this.color = _status.color;
      this.text = _status.vi;
      if (typeof _status.textColor !== "undefined")
        this.textColor = _status.textColor;
      if (typeof _status.icon !== "undefined") this.icon = _status.icon;
    } else {
      this.color = "info";
      this.text = this.status;
    }
  }
}
</script>
