import { useState, useEffect, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { authReady, user } = useAuthContext();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(
        data.map((r: any) => ({
          id: r.id,
          name: r.name,
          quantity: Number(r.quantity),
          unit: r.unit ?? "piece",
          category: r.category ?? "General",
          lowStockThreshold: Number(r.low_stock_threshold ?? 0),
          notes: r.notes ?? "",
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authReady) {
      setLoading(true);
      return;
    }

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    fetchItems();
  }, [authReady, user, fetchItems]);

  const addItem = useCallback(async (item: InventoryItem) => {
    const { error } = await supabase.from("inventory").insert({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      low_stock_threshold: item.lowStockThreshold,
      notes: item.notes,
    });
    if (!error) fetchItems();
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback(async (item: InventoryItem) => {
    const { error } = await supabase
      .from("inventory")
      .update({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        low_stock_threshold: item.lowStockThreshold,
        notes: item.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);
    if (!error) fetchItems();
  }, [fetchItems]);

  return { items, loading, addItem, deleteItem, updateItem };
}
