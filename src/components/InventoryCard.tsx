import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, AlertTriangle, Package } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InventoryForm } from "./InventoryForm";
import { useAuthContext } from "@/contexts/AuthContext";

interface InventoryCardProps {
  item: InventoryItem;
  onDelete: (id: string) => void;
  onUpdate: (item: InventoryItem) => void;
}

export function InventoryCard({ item, onDelete, onUpdate }: InventoryCardProps) {
  const { canEdit, isAdmin } = useAuthContext();
  const isLowStock = item.lowStockThreshold > 0 && item.quantity <= item.lowStockThreshold;

  return (
    <Card className={`group animate-fade-in overflow-hidden transition-shadow hover:shadow-lg ${isLowStock ? "border-destructive/50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="mb-1 inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary">
              {item.category}
            </span>
            <CardTitle className="font-display text-xl leading-tight">{item.name}</CardTitle>
          </div>
          {canEdit && (
            <div className="flex shrink-0 gap-1">
              <InventoryForm
                initial={item}
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
                      <AlertDialogTitle>Delete "{item.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. The item will be permanently removed from your inventory.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Stock</span>
            </div>
            <span className="font-display text-2xl font-bold tabular-nums">
              {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(2)} <span className="text-base font-normal text-muted-foreground">{item.unit}</span>
            </span>
          </div>
          {isLowStock && (
            <div className="mt-2 flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Low stock — threshold: {item.lowStockThreshold} {item.unit}</span>
            </div>
          )}
        </div>

        {item.notes && (
          <p className="text-sm text-muted-foreground">{item.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
