import { Vue, Component } from "vue-property-decorator";
import { formatDatetime } from "@/utils/tool";

@Component
export default class FormValidate extends Vue {
  required(propertyType: any) {
    return (v: string) =>
      (v && (!!v || v.length > 0)) || `You must input a ${propertyType}`;
  }

  // input length must greater than min length
  minLength(propertyType: any, minLength: number) {
    return (v: string) =>
      (v && v.length >= minLength) ||
      `${propertyType} phải có ít nhất ${minLength} ký tự`;
  }

  // input length must less than max length
  maxLength(propertyType: any, maxLength: number) {
    return (v: string) =>
      (v && v.length <= maxLength) ||
      `${propertyType} chỉ có nhiều nhất ${maxLength} ký tự`;
  }

  // input must be email type
  email(propertyType: any) {
    return (v: string) =>
      (v && /.+@.+\..+/.test(v)) || ` Email ${propertyType} không hợp lệ`;
  }

  // input must greater than min number
  minNumber(propertyType: any, minNumber: number) {
    return (v: number) =>
      (v && v > minNumber) ||
      `${propertyType} phải lớn hơn ${minNumber}`;
  }

  // input must less than max number
  maxNumber(propertyType: any, maxNumber: number) {
    return (v: number) =>
      (v && v < maxNumber) || `${propertyType} phải nhỏ hơn ${maxNumber}`;
  }
  minTime(propertyType: any, minTime: string) {
    return (v: string) =>
      (v && new Date(v).getTime() > new Date(minTime).getTime()) ||
      `${propertyType} cần lớn hơn ngày ${formatDatetime(minTime)}`;
  }
  maxTime(propertyType: any, maxTime: string) {
    return (v: string) =>
      (v && new Date(v).getTime() < new Date(maxTime).getTime()) ||
      `${propertyType} cần nhỏ hơn ngày ${formatDatetime(maxTime)}`;
  }
}
