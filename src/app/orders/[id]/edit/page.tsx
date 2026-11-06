import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { OrderSummary } from "../../../../types/order-summary";

async function updateOrder(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const item = formData.get("item");
  const quantity = Number(formData.get("quantity"));
  const status = formData.get("status");

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item, quantity, status }),
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");
  if (!response?.ok) redirect(`/orders/${id}/edit?error=1`);

  redirect("/orders");
}

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditOrderPage({ params, searchParams }: EditOrderPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");

  const data = response?.ok ? await response.json().catch(() => null) : null;
  const orders: OrderSummary[] | null = Array.isArray(data) ? data : null;
  const order = orders?.find((o) => String(o.id) === id);

  if (!order) {
    return (
      <main>
        <h1>Editar pedido</h1>
        <p role="alert">No se encontró el pedido.</p>
        <Link href="/orders">Volver a pedidos</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Editar pedido #{order.id}</h1>
      {error === "1" && <p role="alert">No se pudo guardar. Revisar los datos o la conexión.</p>}

      <form action={updateOrder}>
        <input type="hidden" name="id" value={order.id} />
        <p>
          <label>
            Producto <input name="item" defaultValue={order.item} required />
          </label>
        </p>
        <p>
          <label>
            Cantidad <input name="quantity" type="number" min={1} defaultValue={order.quantity} required />
          </label>
        </p>
        <p>
          <label>
            Estado
            <select name="status" defaultValue={order.status}>
              <option value="pending">Pendiente</option>
              <option value="ready">Listo</option>
            </select>
          </label>
        </p>
        <button type="submit">Guardar cambios</button>
      </form>
      <p>
        <Link href="/orders">Cancelar</Link>
      </p>
    </main>
  );
}
