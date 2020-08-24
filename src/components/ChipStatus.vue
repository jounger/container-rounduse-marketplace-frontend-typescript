<template>
  <v-chip :color="color" :text-color="textColor" :small="sub">
    <v-icon left :small="sub">{{ icon }}</v-icon>
    {{ text }}
  </v-chip>
</template>

<script lang="ts">
export interface Matching {
  en: string;
  vi: string;
  color: string;
  icon?: string;
  textColor?: string;
}

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
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
    { en: "CREATED", vi: "Đã tạo", color: "indigo" },
    { en: "BIDDING", vi: "Đang đấu thầu", color: "deep-purple" },
    { en: "PENDING", vi: "Đang chờ", color: "deep-purple" },
    { en: "SHIPPING", vi: "Đang vận chuyển", color: "warning" },
    // INFO
    { en: "INFO_RECEIVED", vi: "Đã nhận lệnh", color: "info" },
    { en: "UPDATED", vi: "Cập nhật", color: "info" },
    // SUCCESS
    { en: "ACCEPTED", vi: "Đã đồng ý", color: "success" },
    { en: "ACTIVE", vi: "Đang hoạt động", color: "success" },
    { en: "COMBINED", vi: "Đã ghép hàng", color: "success" },
    { en: "DELIVERED", vi: "Đã giao hàng", color: "success" },
    { en: "RESOLVED", vi: "Đã giải quyết", color: "success" },
    { en: "PAID", vi: "Đã thanh toán", color: "success" },
    // WARNING
    { en: "CANCELED", vi: "Đã hủy", color: "warning" },
    { en: "CANCEL", vi: "Đã hủy", color: "warning" },
    // ERROR
    { en: "REJECTED", vi: "Đã từ chối", color: "error" },
    { en: "BANNED", vi: "Bị cấm", color: "error" },
    { en: "EXCEPTION", vi: "Có lỗi xảy ra", color: "error" },
    // EXPIRED
    { en: "EXPIRED", vi: "Đã hết hạn", color: "expired" },
    { en: "CLOSED", vi: "Đã đóng", color: "expired" }
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
      color: "deep-purple",
      icon: "monetization_on"
    },
    {
      en: "SHIPPING",
      vi: "Vận chuyển",
      color: "info",
      icon: "local_shipping"
    },
    {
      en: "COMBINED",
      vi: "Hàng ghép",
      color: "success",
      icon: "directions_boat"
    }
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
    { en: "CLOSED", vi: "Đóng", color: "expired" },
    // DRIVER + SHIPPINGLINE
    { en: "REQUEST", vi: "Yêu cầu mượn", color: "info" },
    { en: "TASK", vi: "Giao việc", color: "primary" },
    { en: "CANCEL", vi: "Hủy yêu cầu", color: "error" }
  ] as Matching[];

  roleMatching = [
    { en: "ROLE_ADMIN", vi: "Quản trị viên", color: "primary" },
    { en: "ROLE_MODERATOR", vi: "Người vận hành", color: "secondary" },
    { en: "ROLE_FORWARDER", vi: "Chủ xe", color: "warning" },
    { en: "ROLE_MERCHANT", vi: "Chủ hàng", color: "tertiary" },
    { en: "ROLE_SHIPPINGLINE", vi: "Hãng tàu", color: "info" },
    { en: "ROLE_DRIVER", vi: "Lái xe", color: "success" }
  ] as Matching[];

  convertProcess(status: string) {
    const _status = this.listMatch.filter(x => x.en == status)[0];
    if (_status) {
      this.color = _status.color;
      this.text = _status.vi;
      if (typeof _status.textColor !== "undefined")
        this.textColor = _status.textColor;
      if (typeof _status.icon !== "undefined") this.icon = _status.icon;
    } else {
      this.color = "info";
      this.text = status;
    }
  }

  @Watch("status")
  onStatusChange(val: string) {
    if (typeof val !== "undefined") {
      console.log("FFF", val);
      this.convertProcess(val);
    }
  }

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
      case "roles":
        this.listMatch = this.roleMatching;
        break;
      default:
        this.listMatch = this.statusMatching;
        break;
    }
    this.convertProcess(this.status);
  }
}
</script>
