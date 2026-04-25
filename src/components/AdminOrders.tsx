import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "../services/orderService";
import type { DeliveryZone, Order, OrderStatus } from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

type StatusFilter = OrderStatus | "all";

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

function formatCurrency(amount: number) {
  return `BDT ${amount.toFixed(2)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPaymentMethod(method: Order["paymentMethod"]) {
  switch (method) {
    case "cod":
      return "Cash On Delivery";
    case "bkash":
      return "bKash";
    case "bank":
      return "Bank Transfer";
    default:
      return method;
  }
}

function getDeliveryZoneLabel(deliveryZone: DeliveryZone) {
  return deliveryZone === "inside_chittagong"
    ? "Inside Chittagong"
    : "Outside Chittagong";
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError("");
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setSelectedOrderId((current) => {
        if (fetchedOrders.length === 0) {
          return null;
        }

        return fetchedOrders.some((order) => order.id === current)
          ? current
          : fetchedOrders[0].id;
      });
    } catch (loadError) {
      console.error("Failed to load orders:", loadError);
      setError(
        "Orders could not be loaded. Make sure the Supabase orders table and policies are set up.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ??
    orders.find((order) => order.id === selectedOrderId) ??
    filteredOrders[0] ??
    orders[0] ??
    null;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const awaitingFulfillmentCount = orders.filter(
    (order) => order.status === "pending" || order.status === "confirmed",
  ).length;
  const shippedCount = orders.filter((order) => order.status === "shipped").length;
  const deliveredCount = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);

    try {
      setError("");
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
      setError("The order status could not be updated. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete order "${order.id}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(order.id);

    try {
      setError("");
      await deleteOrder(order.id);
      setOrders((current) => current.filter((item) => item.id !== order.id));
      setSelectedOrderId((current) => (current === order.id ? null : current));
    } catch (deleteError) {
      console.error("Failed to delete order:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "The order could not be deleted. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-[#1A2E28]">
                {orders.length}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-[#2F5D50]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Awaiting Fulfillment</p>
              <p className="mt-2 text-3xl font-bold text-[#1A2E28]">
                {awaitingFulfillmentCount}
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-[#F4A261]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Shipped</p>
              <p className="mt-2 text-3xl font-bold text-[#1A2E28]">
                {shippedCount}
              </p>
            </div>
            <Truck className="h-8 w-8 text-[#2F5D50]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-[#1A2E28]">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <CircleDollarSign className="h-8 w-8 text-[#2F5D50]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white shadow-lg">
          <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1A2E28]">
                Incoming Orders
              </h2>
              <p className="mt-1 text-sm text-[#4a6b5f]">
                Review new orders, monitor revenue, and update delivery progress.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="rounded-full border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void loadOrders(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#2F5D50] transition hover:bg-[#F8FAFC]"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center px-6 py-10 text-sm text-[#4a6b5f]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#2F5D50]" />
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="min-h-[320px] px-6 py-10 text-center text-[#4a6b5f]">
              <p className="text-lg font-semibold text-[#1A2E28]">
                No orders found
              </p>
              <p className="mt-2 text-sm">
                New checkout orders will appear here after your Supabase setup is
                complete.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-[#334155]">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-[#64748B]">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Placed</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-t border-[#E5E7EB] transition ${
                        selectedOrder?.id === order.id ? "bg-[#F8FAFC]" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-left"
                        >
                          <p className="font-semibold text-[#0F172A]">
                            {order.id}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {formatPaymentMethod(order.paymentMethod)}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0F172A]">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {order.shippingAddress.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#475569]">
                        {order.items.length}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0F172A]">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.status]}`}
                        >
                          {formatStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#475569]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              void handleStatusUpdate(
                                order.id,
                                event.target.value as OrderStatus,
                              )
                            }
                            disabled={
                              updatingId === order.id || deletingId === order.id
                            }
                            className="rounded-full border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] focus:border-[#2F5D50] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatusLabel(status)}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => void handleDeleteOrder(order)}
                            disabled={deletingId === order.id}
                            className="rounded-full bg-[#F87171]/15 px-3 py-2 text-xs font-semibold text-[#B91C1C] transition hover:bg-[#F87171]/25 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === order.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-[#F4A261]">
                  Order Detail
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#1A2E28]">
                  {selectedOrder?.id ?? "Select an order"}
                </h2>
              </div>
              {selectedOrder && (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[selectedOrder.status]}`}
                >
                  {formatStatusLabel(selectedOrder.status)}
                </span>
              )}
            </div>

            {!selectedOrder ? (
              <p className="mt-6 text-sm text-[#4a6b5f]">
                Pick an order from the list to inspect the customer information
                and line items.
              </p>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#64748B]">
                      Customer
                    </p>
                    <p className="mt-2 font-semibold text-[#1A2E28]">
                      {selectedOrder.shippingAddress.firstName}{" "}
                      {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p className="mt-1 text-sm text-[#4a6b5f]">
                      {selectedOrder.shippingAddress.email}
                    </p>
                    <p className="text-sm text-[#4a6b5f]">
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#64748B]">
                      Delivery Address
                    </p>
                    <p className="mt-2 text-sm text-[#1A2E28]">
                      {selectedOrder.shippingAddress.address}
                    </p>
                    <p className="mt-1 text-sm text-[#4a6b5f]">
                      {selectedOrder.shippingAddress.city}
                    </p>
                    <p className="text-sm text-[#4a6b5f]">
                      {getDeliveryZoneLabel(selectedOrder.shippingAddress.deliveryZone)}
                    </p>
                    <p className="text-sm text-[#4a6b5f]">
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1A2E28]">
                      Line Items
                    </h3>
                    <p className="text-sm text-[#64748B]">
                      {selectedOrder.items.length} items
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedOrder.items.map(({ product, quantity }) => (
                      <div
                        key={`${selectedOrder.id}-${product.id}`}
                        className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] p-4"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#1A2E28]">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#4a6b5f]">
                            {product.unit}
                          </p>
                          <p className="text-sm text-[#64748B]">
                            Qty: {quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-[#2F5D50]">
                          {formatCurrency(getDiscountedPrice(product) * quantity)}
                        </p>
                        {hasDiscount(product) && (
                          <p className="text-xs text-[#64748B] line-through">
                            {formatCurrency(product.price * quantity)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#1A2E28] p-5 text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#A8C686]" />
                    <p className="font-semibold">Order totals</p>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-xs text-white/60">
                      <span>Placed</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1A2E28]">
              Delivery Snapshot
            </h3>
            <p className="mt-1 text-sm text-[#4a6b5f]">
              Keep this section moving by updating statuses as you confirm,
              dispatch, and complete each order.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-3">
                <span className="text-sm text-[#4a6b5f]">Delivered</span>
                <span className="font-semibold text-[#1A2E28]">
                  {deliveredCount}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-3">
                <span className="text-sm text-[#4a6b5f]">Shipped</span>
                <span className="font-semibold text-[#1A2E28]">
                  {shippedCount}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-3">
                <span className="text-sm text-[#4a6b5f]">Awaiting action</span>
                <span className="font-semibold text-[#1A2E28]">
                  {awaitingFulfillmentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
