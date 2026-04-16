"use client";

import { useActionState } from "react";
import { createRestaurantAction, updateRestaurantAction } from "@/actions/restaurant";
import type { Restaurant } from "@/db/schema";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ActionState = { success: boolean; error?: string; fieldErrors?: Record<string, string[]> };
const initial: ActionState = { success: false };

export function RestaurantForm({ restaurant }: { restaurant: Restaurant | null }) {
  const actionFn = restaurant ? updateRestaurantAction : createRestaurantAction;
  const [state, action, pending] = useActionState(actionFn, initial);

  return (
    <form action={action} className="bg-white border rounded-xl p-6 space-y-4">
      {restaurant && <input type="hidden" name="restaurantId" value={restaurant.id} />}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <Input name="name" label="Restaurant name" defaultValue={restaurant?.name ?? ""} required error={state.fieldErrors?.name?.[0]} />
        <Input name="slug" label="Slug" defaultValue={restaurant?.slug ?? ""} required error={state.fieldErrors?.slug?.[0]} />
      </div>
      <Textarea name="description" label="Description" defaultValue={restaurant?.description ?? ""} rows={3} />
      <div className="grid md:grid-cols-2 gap-4">
        <Input name="phone" label="Phone" defaultValue={restaurant?.phone ?? ""} />
        <Input name="lineContact" label="Line ID" defaultValue={restaurant?.lineContact ?? ""} />
      </div>
      <Input name="googleMapsUrl" label="Google Maps URL" defaultValue={restaurant?.googleMapsUrl ?? ""} error={state.fieldErrors?.googleMapsUrl?.[0]} />
      <Input name="address" label="Address" defaultValue={restaurant?.address ?? ""} />
      <div className="grid md:grid-cols-2 gap-4">
        <Input name="logoUrl" label="Logo URL" defaultValue={restaurant?.logoUrl ?? ""} error={state.fieldErrors?.logoUrl?.[0]} />
        <Input name="coverUrl" label="Cover image URL" defaultValue={restaurant?.coverUrl ?? ""} error={state.fieldErrors?.coverUrl?.[0]} />
      </div>
      <Input name="themeColor" type="color" label="Theme color" defaultValue={restaurant?.themeColor ?? "#f97316"} />
      <input type="hidden" name="openingHours" value={restaurant?.openingHours ?? ""} />
      <Button type="submit" loading={pending}>{restaurant ? "Save changes" : "Create restaurant"}</Button>
    </form>
  );
}
