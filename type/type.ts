export interface AuthInitialState {
  loading: boolean;
  error: null | string;
}

export interface MaterialInitialState {
  loading: boolean;
  material: Material[];
  currentMaterial: Material;
  failed: boolean;
}

export interface Material {
  id: string;
  sloc: number;
  code: number;
  name: string;
  unit: string;
  bringForward: number;
  stockIn: number;
  stockOut: number;
  balance: number;
  stockCount: number;
  note: string;
  createDate: Date;
  modifyDate: Date;
}

export enum EnumMode {
  Create = "Create",
  Edit = "Edit",
}

export interface CurrentPayload {
  name: keyof Material;
  value: string | number;
}

export interface InputArray {
  name: keyof Material;
  type: string;
  class: string;
  display: string;
}
