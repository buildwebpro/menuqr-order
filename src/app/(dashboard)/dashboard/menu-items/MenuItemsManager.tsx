"use client";

import { useActionState, useState } from "react";
import { createMenuItemAction, deleteMenuItemAction, toggleItemAvailabilityAction } from "@/actions/menu-items";
import type { MenuCategory, MenuItem, Restaurant } from "@/db/schema";
import type { ActionResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { th } from "@/lib/i18n";

const initialState: ActionResult = { success: false };

export function MenuItemsManager({ restaurant, items, categories }: { restaurant: Restaurant; items: MenuItem[]; categories: MenuCategory[] }) {
  const [state, action, pending] = useActionState(createMenuItemAction, initialState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{th.menuItems.title}</h1>
        <p className="text-gray-500">{th.menuItems.description}</p>
      </div>

      <form action={action} className="bg-white border rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        {state.error && <p className="text-sm text-red-600 col-span-full">{state.error}</p>}
        <Input name="name" label={th.menuItems.itemName} required error={state.fieldErrors?.name?.[0]} />
        <Input name="price" type="number" step="0.01" min="0" label={th.menuItems.price} required error={state.fieldErrors?.price?.[0]} />
        <Select name="categoryId" label={th.menuItems.category} options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="ไม่มีหมวดหมู่" />
        <div className="flex items-end"><Button type="submit" loading={pending}>{th.menuItems.addItem}</Button></div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">{th.menuItems.noItems}</p>
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
        <Badge variant={item.isAvailable ? "success" : "warning"}>{item.isAvailable ? th.menuItems.available : th.menuItems.unavailable}</Badge>
        <Button variant="outline" size="sm" onClick={handleToggle} loading={isTogglingAvail}>{th.categories.toggle}</Button>
        <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>{th.categories.delete}</Button>
      </div>
    </div>
  );
}
