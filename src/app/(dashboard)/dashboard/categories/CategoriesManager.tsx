"use client";

import { useActionState, useState } from "react";
import type { MenuCategory, Restaurant } from "@/db/schema";
import { createCategoryAction, deleteCategoryAction, toggleCategoryVisibilityAction } from "@/actions/categories";
import type { ActionResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const initialState: ActionResult = { success: false };

export function CategoriesManager({ restaurant, categories }: { restaurant: Restaurant; categories: MenuCategory[] }) {
  const [state, action, pending] = useActionState(createCategoryAction, initialState);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500">Organize your menu sections and visibility.</p>
      </div>

      <form action={action} className="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-3">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        {state.error && <p className="text-sm text-red-600 col-span-full">{state.error}</p>}
        <Input name="name" label="New category" value={name} onChange={(e) => setName(e.target.value)} required error={state.fieldErrors?.name?.[0]} />
        <Input name="description" label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} error={state.fieldErrors?.description?.[0]} />
        <div className="flex items-end"><Button type="submit" loading={pending}>Add Category</Button></div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} restaurant={restaurant} />
          ))
        )}
      </div>
    </div>
  );
}

function CategoryRow({ category, restaurant }: { category: MenuCategory; restaurant: Restaurant }) {
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsTogglingVisibility(true);
    await toggleCategoryVisibilityAction(category.id, restaurant.id, !category.isVisible);
    setIsTogglingVisibility(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCategoryAction(category.id, restaurant.id);
    setIsDeleting(false);
  };

  return (
    <div className="p-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-medium text-gray-900">{category.name}</p>
        {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={category.isVisible ? "success" : "default"}>{category.isVisible ? "Visible" : "Hidden"}</Badge>
        <Button variant="outline" size="sm" onClick={handleToggle} loading={isTogglingVisibility}>Toggle</Button>
        <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>Delete</Button>
      </div>
    </div>
  );
}
