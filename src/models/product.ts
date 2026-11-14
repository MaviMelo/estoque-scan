export interface Product {
  id?: number;
  barcode?: string;
  name: string;
  description?: string;
  quantity: number;
  min_quantity?: number;
  unit_type: string;
  unit_price?: number;
  price?: number;
  category_id?: number;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  barcode?: string;
  name: string;
  description?: string;
  quantity?: number;
  min_quantity?: number;
  unit_type?: string;
  unit_price?: number;
  price?: number;
  category_id?: number;
}
