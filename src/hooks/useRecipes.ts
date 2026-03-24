import { useState, useEffect, useCallback } from "react";
import { Recipe } from "@/types/recipe";
import { supabase } from "@/integrations/supabase/client";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = useCallback(async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecipes(
        data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description ?? "",
          category: r.category ?? "Main Course",
          baseServings: r.base_servings ?? 4,
          instructions: r.instructions ?? "",
          ingredients: r.ingredients ?? [],
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const addRecipe = useCallback(async (recipe: Recipe) => {
    const { error } = await supabase.from("recipes").insert({
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      base_servings: recipe.baseServings,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
    });
    if (!error) fetchRecipes();
  }, [fetchRecipes]);

  const deleteRecipe = useCallback(async (id: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRecipe = useCallback(async (recipe: Recipe) => {
    const { error } = await supabase
      .from("recipes")
      .update({
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        base_servings: recipe.baseServings,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients,
      })
      .eq("id", recipe.id);
    if (!error) fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, addRecipe, deleteRecipe, updateRecipe };
}
