export interface AuthInitialState {
  loading: boolean;
  error: null | string;
}

export interface MaterialInitialState {
  loading: boolean;
  material: Material[];
  allMaterials: Material[];
  currentMaterial: Material;
  failed: boolean;
  totalPages: number;
  defaultMaterial: Material;
}

export interface StockCountInitialState {
  loading: boolean;
  stockCounts: StockCountWithMaterial[];
  allStockCounts: StockCountWithMaterial[];
  currentStockCount: StockCountWithMaterial;
  failed: boolean;
  totalPages: number;
  defaultStockCount: StockCountWithMaterial;
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
  createDate: string;
  modifyDate: string;
}

export interface StockCount {
  id: number;
  stockCode: string;
  materialId: string;
  countedQty: number;
  systemQty: number;
  countDiff: number;
  countedDate: string;
  createdDate: string;
  lastUpdated: string;
  note: string | null;
}

export interface StockCountWithMaterial extends StockCount {
  material: Material;
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

export interface SelectArray {
  display: string;
  name: keyof SelectState;
  optionArray: OptionArray[];
}

export interface OptionArray {
  display: string;
  value: string;
}

export interface SelectState {
  order: string;
  sort: string;
  itemsPerPage: string;
}

export interface GetMaterialProps {
  select: SelectState;
  currentPage: number;
  search: string;
  all: boolean;
}

export interface GetStockCountProps {
  select: SelectState;
  currentPage: number;
  search: string;
  all: boolean;
}
