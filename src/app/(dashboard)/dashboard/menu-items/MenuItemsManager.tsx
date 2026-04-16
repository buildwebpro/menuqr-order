"use client";

import { createMenuItemAction, deleteMenuItemAction, toggleItemAvailabilityAction } from "@/actions/menu-items";
import type { MenuCategory, MenuItem, Restaurant } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export function MenuItemsManager({ restaurant, items, categories }: { restaurant: Restaurant; items: MenuItem[]; categories: MenuCategory[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
        <p className="text-gray-500">Add dishes and manage availability.</p>
      </div>

      <form action={async (formData) => { await createMenuItemAction({ success: false }, formData); }} className="bg-white border rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        <Input name="name" label="Item name" required />
        <Input name="price" type="number" step="0.01" min="0" label="Price" required />
        <Select name="categoryId" label="Category" options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="No category" />
        <div className="flex items-end"><Button type="submit">Add Item</Button></div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No menu items yet.</p>
        ) : items.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={item.isAvailable ? "success" : "warning"}>{item.isAvailable ? "Available" : "Unavailable"}</Badge>
              <form action={async () => { "use server"; await toggleItemAvailabilityAction(item.id, restaurant.id, !item.isAvailable); }}>
                <Button variant="outline" size="sm">Toggle</Button>
              </form>
              <form action={async () => { "use server"; await deleteMenuItemAction(item.id, restaurant.id); }}>
                <Button variant="danger" size="sm">Delete</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
