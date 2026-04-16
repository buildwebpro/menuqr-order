"use client";

import { useActionState, useState } from "react";
import { createMenuItemAction, deleteMenuItemAction, toggleItemAvailabilityAction } from "@/actions/menu-items";
import type { MenuCategory, MenuItem, Restaurant } from "@/db/schema";
import type { ActionResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const initialState: ActionResult = { success: false };

export function MenuItemsManager({ restaurant, items, categories }: { restaurant: Restaurant; items: MenuItem[]; categories: MenuCategory[] }) {
  const [state, action, pending] = useActionState(createMenuItemAction, initialState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
        <p className="text-gray-500">Add dishes and manage availability.</p>
      </div>

      <form action={action} className="bg-white border rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        {state.error && <p className="text-sm text-red-600 col-span-full">{state.error}</p>}
        <Input name="name" label="Item name" required error={state.fieldErrors?.name?.[0]} />
        <Input name="price" type="number" step="0.01" min="0" label="Price" required error={state.fieldErrors?.price?.[0]} />
        <Select name="categoryId" label="Category" options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="No category" />
        <div className="flex items-end"><Button type="submit" loading={pending}>Add Item</Button></div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No menu items yet.</p>
        ) : (
          items.map((item) => (
            <MenuItemRow key={item.id} item={item} restaurant={restaurant} />
          ))
        )}
      </div>
    </div>
  );
}

function MenuItemRow({ item, restaurant }: { item: MenuItem; restaurant: Restaurant }) {
  const [isTogglingAvail, setIsTogglingAvail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsTogglingAvail(true);
    await toggleItemAvailabilityAction(item.id, restaurant.id, !item.isAvailable);
    setIsTogglingAvail(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteMenuItemAction(item.id, restaurant.id);
    setIsDeleting(false);
  };

  return (
    <div className="p-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={item.isAvailable ? "success" : "warning"}>{item.isAvailable ? "Available" : "Unavailable"}</Badge>
        <Button variant="outline" size="sm" onClick={handleToggle} loading={isTogglingAvail}>Toggle</Button>
        <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>Delete</Button>
      </div>
    </div>
  );
}
