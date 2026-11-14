export type MovementType = "in" | "out";

export interface Movement {
  id?: number;
  product_id: number;
  type: MovementType;
  quantity: number;
  created_at?: string;
}

export interface MovementInput {
  product_id: number;
  type: MovementType;
  quantity: number;
}
