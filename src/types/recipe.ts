export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  baseServings: number;
  ingredients: Ingredient[];
  instructions: string;
  category: string;
}

export const UNITS = [
  "g", "kg", "ml", "L", "cup", "tbsp", "tsp", "oz", "lb", "piece", "bunch", "clove", "pinch",
] as const;

export const CATEGORIES = [
  "Appetizer", "Main Course", "Side Dish", "Dessert", "Beverage", "Sauce", "Bread", "Salad",
] as const;
