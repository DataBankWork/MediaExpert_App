import { ActionType } from "../enums/ProductEnums";

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

export interface ProductWithType extends Product {
  type: ActionType;
}
