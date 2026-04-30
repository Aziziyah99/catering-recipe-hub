import { useRecipes } from "@/hooks/useRecipes";
import { useInventory } from "@/hooks/useInventory";
import { ChefHat, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const HomePage = () => {
  const { recipes } = useRecipes();
  const { items } = useInventory();
  const navigate = useNavigate();

  const lowStockItems = items.filter(
    (i) => i.lowStockThreshold > 0 && i.quantity <= i.lowStockThreshold
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 py-8">
          <img src={logo} alt="Rakhsha's Kitchen" className="h-14 w-auto" />
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Bismillah Kitchen
            </h1>
            <p className="text-sm text-muted-foreground">
              Recipe collection &amp; inventory manager
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-8">
        {/* About Section */}
        <section className="rounded-xl bg-card p-6 shadow-sm border">
          <h2 className="font-display text-xl font-semibold mb-2">About the Kitchen</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Rakhsha's Kitchen — a passion-driven catering service bringing authentic, homemade flavors to every occasion. With years of experience crafting dishes that bring people together, our kitchen blends tradition with creativity. Every recipe is made with love, fresh ingredients, and a commitment to quality that you can taste in every bite.
          </p>
        </section>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/recipes")}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Recipes</p>
                <p className="font-display text-3xl font-bold">{recipes.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/inventory")}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Package className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Items</p>
                <p className="font-display text-3xl font-bold">{items.length}</p>
              </div>
            </CardContent>
          </Card>

          {lowStockItems.length > 0 && (
            <Card
              className="cursor-pointer border-destructive/30 transition-shadow hover:shadow-lg"
              onClick={() => navigate("/inventory")}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="font-display text-3xl font-bold">{lowStockItems.length}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Low stock list */}
        {lowStockItems.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold">⚠️ Low Stock Items</h2>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-destructive/5 px-4 py-3">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit} remaining
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
