import { useState, useEffect } from "react";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeCard } from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { seedBiryani } from "@/scripts/seedRecipe";
import logo from "@/assets/logo.png";

const Index = () => {
  const { recipes, loading, addRecipe, deleteRecipe, updateRecipe } = useRecipes();

  // One-time seed — remove after first load
  useEffect(() => {
    const seeded = localStorage.getItem("seeded-biryani-v2");
    if (!seeded) {
      localStorage.removeItem("seeded-biryani");
      seedBiryani().then(() => {
        localStorage.setItem("seeded-biryani-v2", "true");
        window.location.reload();
      });
    }
  }, []);

  const [search, setSearch] = useState("");

  const filtered = recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
<div className="flex items-center gap-3">
            <img src={logo} alt="Rakhsha's Kitchen" className="h-14 w-auto" />
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                My Catering Kitchen
              </h1>
              <p className="text-sm text-muted-foreground">
                Recipe collection &amp; serving calculator
              </p>
            </div>
          </div>
          <RecipeForm onSave={addRecipe} />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {recipes.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recipes or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={deleteRecipe}
                onUpdate={updateRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ChefHat className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold">
              {search ? "No recipes found" : "Your kitchen is empty"}
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Start building your catering recipe collection. Add your first recipe and calculate ingredients for any number of servings."}
            </p>
            {!search && <div className="mt-6"><RecipeForm onSave={addRecipe} /></div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
