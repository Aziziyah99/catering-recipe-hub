import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { InventoryForm } from "@/components/InventoryForm";
import { InventoryCard } from "@/components/InventoryCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const InventoryPage = () => {
  const { items, loading, addItem, deleteItem, updateItem } = useInventory();
  const { canEdit } = useAuthContext();
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Inventory
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your grocery stock
            </p>
          </div>
          {canEdit && <InventoryForm onSave={addItem} />}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {items.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items or categories..."
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
            {filtered.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onDelete={deleteItem}
                onUpdate={updateItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <img src={logo} alt="Rakhsha's Kitchen" className="h-12 w-auto" />
            </div>
            <h2 className="font-display text-2xl font-semibold">
              {search ? "No items found" : "Your inventory is empty"}
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Start tracking your grocery stock. Add items and set low-stock alerts."}
            </p>
            {!search && canEdit && <div className="mt-6"><InventoryForm onSave={addItem} /></div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default InventoryPage;
