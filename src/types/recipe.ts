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
  "lb", "oz", "cup", "tbsp", "tsp", "quart", "gallon", "pint", "piece", "bunch", "clove", "pinch", "g", "kg", "ml", "L",
] as const;

export const CATEGORIES = [
  "Appetizer", "Main Course", "Side Dish", "Dessert", "Beverage", "Sauce", "Bread", "Salad",
] as const;
