import { useState } from "react";
import { InventoryItem, INVENTORY_CATEGORIES } from "@/types/inventory";
import { UNITS } from "@/types/recipe";
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
import { Plus } from "lucide-react";

interface InventoryFormProps {
  onSave: (item: InventoryItem) => void;
  initial?: InventoryItem;
  trigger?: React.ReactNode;
}

export function InventoryForm({ onSave, initial, trigger }: InventoryFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0);
  const [unit, setUnit] = useState(initial?.unit ?? "piece");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [lowStockThreshold, setLowStockThreshold] = useState(initial?.lowStockThreshold ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const reset = () => {
    if (!initial) {
      setName(""); setQuantity(0); setUnit("piece");
      setCategory("General"); setLowStockThreshold(0); setNotes("");
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name, quantity, unit, category, lowStockThreshold, notes,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="gap-2 font-display text-base">
            <Plus className="h-5 w-5" /> Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "Edit Item" : "New Grocery Item"}
          </DialogTitle>
          <DialogDescription>
            {initial ? "Update your inventory item." : "Add a new item to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Basmati Rice" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVENTORY_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min={0} step="any" value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Low Stock Alert</Label>
              <Input type="number" min={0} step="any" value={lowStockThreshold || ""} onChange={(e) => setLowStockThreshold(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} />
          </div>

          <Button onClick={handleSubmit} className="w-full font-display text-base" size="lg">
            {initial ? "Update Item" : "Add to Inventory"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
