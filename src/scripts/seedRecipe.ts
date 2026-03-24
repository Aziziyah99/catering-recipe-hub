// One-time seed script — run via browser console or import temporarily
import { supabase } from "@/integrations/supabase/client";

export async function seedBiryani() {
  // Remove old version first
  await supabase.from("recipes").delete().eq("name", "Chicken Biryani");
  const { error } = await supabase.from("recipes").insert({
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken, caramelized onions, and fresh herbs — a showstopper for any gathering.",
    category: "Main Course",
    base_servings: 20,
    instructions: `1. Marinate chicken with yogurt, ginger-garlic paste, chili powder, turmeric, garam masala, and salt for at least 2 hours.
2. Soak basmati rice for 30 minutes, then parboil until 70% cooked. Drain and set aside.
3. Slice onions thinly and deep fry until golden brown. Set aside for garnish.
4. In a heavy-bottomed pot, layer marinated chicken at the bottom.
5. Add a layer of parboiled rice on top.
6. Sprinkle fried onions, chopped mint, cilantro, saffron milk, and ghee.
7. Repeat layers if needed.
8. Seal the pot with aluminum foil and a tight lid (dum style).
9. Cook on high heat for 5 minutes, then reduce to low and cook for 25-30 minutes.
10. Let it rest for 10 minutes before gently mixing and serving.`,
    ingredients: [
      { id: "1", name: "Chicken (bone-in pieces)", quantity: 11, unit: "lb" },
      { id: "2", name: "Basmati Rice", quantity: 9, unit: "lb" },
      { id: "3", name: "Onions (large)", quantity: 15, unit: "piece" },
      { id: "4", name: "Yogurt", quantity: 4, unit: "cup" },
      { id: "5", name: "Ginger-Garlic Paste", quantity: 7, unit: "oz" },
      { id: "6", name: "Green Chilies", quantity: 15, unit: "piece" },
      { id: "7", name: "Fresh Mint", quantity: 4, unit: "bunch" },
      { id: "8", name: "Fresh Cilantro", quantity: 4, unit: "bunch" },
      { id: "9", name: "Ghee", quantity: 1.25, unit: "cup" },
      { id: "10", name: "Saffron", quantity: 1, unit: "pinch" },
      { id: "11", name: "Garam Masala", quantity: 4, unit: "tbsp" },
      { id: "12", name: "Red Chili Powder", quantity: 3, unit: "tbsp" },
      { id: "13", name: "Turmeric", quantity: 1.5, unit: "tbsp" },
      { id: "14", name: "Salt", quantity: 5, unit: "tbsp" },
      { id: "15", name: "Oil (for frying onions)", quantity: 2, unit: "cup" },
    ],
  });
  if (error) console.error("Seed error:", error);
  else console.log("✅ Chicken Biryani seeded!");
}
