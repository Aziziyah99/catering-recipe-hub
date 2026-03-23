import { useState } from "react";
import { Recipe, Ingredient, UNITS, CATEGORIES } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void;
  initial?: Recipe;
  trigger?: React.ReactNode;
}

export function RecipeForm({ onSave, initial, trigger }: RecipeFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Main Course");
  const [baseServings, setBaseServings] = useState(initial?.baseServings ?? 4);
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients ?? [{ id: crypto.randomUUID(), name: "", quantity: 0, unit: "g" }]
  );

  const reset = () => {
    if (!initial) {
      setName(""); setDescription(""); setCategory("Main Course");
      setBaseServings(4); setInstructions("");
      setIngredients([{ id: crypto.randomUUID(), name: "", quantity: 0, unit: "g" }]);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: crypto.randomUUID(), name: "", quantity: 0, unit: "g" }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleSubmit = () => {
    if (!name.trim() || ingredients.some((i) => !i.name.trim())) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name, description, category, baseServings, instructions,
      ingredients: ingredients.filter((i) => i.name.trim()),
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="gap-2 font-display text-base">
            <Plus className="h-5 w-5" /> Add Recipe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "Edit Recipe" : "New Recipe"}
          </DialogTitle>
          <DialogDescription>
            {initial ? "Update your recipe details below." : "Add a new recipe to your collection."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Recipe Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken Biryani" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description..." />
          </div>

          <div className="space-y-2">
            <Label>Base Servings</Label>
            <Input type="number" min={1} value={baseServings} onChange={(e) => setBaseServings(Number(e.target.value))} className="w-32" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Ingredients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2">
                <Input
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={ing.quantity || ""}
                  onChange={(e) => updateIngredient(ing.id, "quantity", Number(e.target.value))}
                  className="w-24"
                  placeholder="Qty"
                />
                <Select value={ing.unit} onValueChange={(v) => updateIngredient(ing.id, "unit", v)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(ing.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Step by step instructions..." rows={4} />
          </div>

          <Button onClick={handleSubmit} className="w-full font-display text-base" size="lg">
            {initial ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
