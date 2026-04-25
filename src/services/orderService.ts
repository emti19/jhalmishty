import { supabase } from "../lib/supabase";
import type { Order, OrderStatus, ShippingAddress } from "../types";

const emptyShippingAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  deliveryZone: "inside_chittagong",
};

function mapOrderRow(row: Record<string, unknown>): Order {
  return {
    id: String(row.id ?? ""),
    items: Array.isArray(row.items) ? row.items : [],
    shippingAddress:
      row.shipping_address && typeof row.shipping_address === "object"
        ? ({ ...emptyShippingAddress, ...row.shipping_address } as ShippingAddress)
        : emptyShippingAddress,
    paymentMethod: String(row.payment_method ?? "card") as Order["paymentMethod"],
    subtotal: Number(row.subtotal ?? 0),
    shipping: Number(row.shipping ?? 0),
    tax: Number(row.tax ?? 0),
    total: Number(row.total ?? 0),
    status: String(row.status ?? "confirmed") as OrderStatus,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export async function createOrder(order: Order): Promise<Order> {
  const payload = {
    id: order.id,
    items: order.items,
    shipping_address: order.shippingAddress,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    status: order.status,
    created_at: order.createdAt,
  };

  const { error } = await supabase.from("orders").insert([payload]);

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...order,
    updatedAt: order.createdAt,
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Record<string, unknown>[]).map(mapOrderRow);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapOrderRow(data as Record<string, unknown>);
}

export async function deleteOrder(id: string): Promise<void> {
  const { count, error } = await supabase
    .from("orders")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (count !== 1) {
    throw new Error(
      "Order was not deleted in Supabase. Make sure the orders table has an authenticated DELETE policy.",
    );
  }
}
