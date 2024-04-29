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
  id: String;
  sloc: number;
  code: number;
  name: String;
  unit: String;
  bringForward: number;
  stockIn: number;
  stockOut: number;
  balance: number;
  stockCount: number;
  note: String;
  createDate: Date;
  modifyDate: Date;
}
