export interface IRole {
  id?: number;
  name: string;
  permissions: Array<string>;
  isSelected?: boolean;
}
