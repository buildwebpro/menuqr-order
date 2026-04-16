"use client";

import { useState } from "react";
import type { MenuCategory, Restaurant } from "@/db/schema";
import { createCategoryAction, deleteCategoryAction, toggleCategoryVisibilityAction } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function CategoriesManager({ restaurant, categories }: { restaurant: Restaurant; categories: MenuCategory[] }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500">Organize your menu sections and visibility.</p>
      </div>

      <form action={async (formData) => { await createCategoryAction({ success: false }, formData); }} className="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-3">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        <Input name="name" label="New category" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input name="description" label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <div className="flex items-end"><Button type="submit">Add Category</Button></div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{cat.name}</p>
                {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={cat.isVisible ? "success" : "default"}>{cat.isVisible ? "Visible" : "Hidden"}</Badge>
                <form action={async () => { "use server"; await toggleCategoryVisibilityAction(cat.id, restaurant.id, !cat.isVisible); }}>
                  <Button variant="outline" size="sm">Toggle</Button>
                </form>
                <form action={async () => { "use server"; await deleteCategoryAction(cat.id, restaurant.id); }}>
                  <Button variant="danger" size="sm">Delete</Button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
