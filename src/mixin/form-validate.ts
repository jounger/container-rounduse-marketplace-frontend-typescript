import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FormValidate extends Vue {

  required(propertyType: any) {
    return (v: string) => (v && (!!v || v.length > 0)) || `You must input a ${propertyType}`;
  }

  // input must greater than min number
  minLength(propertyType: any, minLength: number) {
    return (v: string) => (v && v.length >= minLength) || `${propertyType} must be greater than ${minLength} characters`;
  }

  // input must less than max number
  maxLength(propertyType: any, maxLength: number) {
    return (v: string) => (v && v.length <= maxLength) || `${propertyType} must be less than ${maxLength} characters`;
  }

  email(propertyType: any) {
    return (v: string) => (v && /.+@.+\..+/.test(v)) || `${propertyType} email is not validate`;
  }
}
