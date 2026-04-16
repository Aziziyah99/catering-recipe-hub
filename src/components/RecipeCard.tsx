import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Users, ChefHat } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RecipeForm } from "./RecipeForm";
import { useAuthContext } from "@/contexts/AuthContext";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onUpdate: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onDelete, onUpdate }: RecipeCardProps) {
  const { canEdit, isAdmin } = useAuthContext();
  const [targetServings, setTargetServings] = useState(recipe.baseServings);
  const multiplier = targetServings / recipe.baseServings;

  const formatQuantity = (qty: number) => {
    const scaled = qty * multiplier;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(2);
  };

  const presets = [10, 20, 50, 100];

  return (
    <Card className="group animate-fade-in overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="mb-1 inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary">
              {recipe.category}
            </span>
            <CardTitle className="font-display text-xl leading-tight">{recipe.name}</CardTitle>
            {recipe.description && (
              <p className="mt-1 text-sm text-muted-foreground">{recipe.description}</p>
            )}
          </div>
          {canEdit && (
            <div className="flex shrink-0 gap-1">
              <RecipeForm
                initial={recipe}
                onSave={onUpdate}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              />
              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{recipe.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. The recipe will be permanently removed.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(recipe.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Serving Calculator */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold">Scale for how many servings?</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={targetServings}
              onChange={(e) => setTargetServings(Math.max(1, Number(e.target.value)))}
              className="w-24 bg-background"
            />
            <span className="text-sm text-muted-foreground">
              (base: {recipe.baseServings})
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setTargetServings(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  targetServings === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-primary/10"
                }`}
              >
                {p} ppl
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-accent-foreground" />
            <h4 className="text-sm font-semibold">Ingredients</h4>
            {multiplier !== 1 && (
              <span className="rounded-full bg-accent/30 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                ×{multiplier.toFixed(1)}
              </span>
            )}
          </div>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex justify-between rounded px-2 py-1.5 text-sm odd:bg-muted/30">
                <span className="font-medium">{ing.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatQuantity(ing.quantity)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h4 className="mb-1 text-sm font-semibold">Instructions</h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {recipe.instructions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
