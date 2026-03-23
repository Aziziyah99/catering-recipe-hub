import { useState, useCallback } from "react";
import { Recipe } from "@/types/recipe";

const STORAGE_KEY = "catering-recipes";

const loadRecipes = (): Recipe[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRecipes = (recipes: Recipe[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes);

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => {
      const next = [...prev, recipe];
      saveRecipes(next);
      return next;
    });
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveRecipes(next);
      return next;
    });
  }, []);

  const updateRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === recipe.id ? recipe : r));
      saveRecipes(next);
      return next;
    });
  }, []);

  return { recipes, addRecipe, deleteRecipe, updateRecipe };
}
