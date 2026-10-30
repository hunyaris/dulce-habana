"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CATEGORIES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_STATUS,
  formatShortDate,
} from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";
import { formatCUP } from "@/lib/store-config";
import {
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Truck,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminView() {
  const { user, setView } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setView("login");
      return;
    }
    Promise.all([
      fetch("/api/admin?action=stats").then((r) => r.json()),
      fetch("/api/admin?action=products").then((r) => r.json()),
      fetch("/api/admin?action=orders").then((r) => r.json()),
      fetch("/api/admin?action=zones").then((r) => r.json()),
    ])
      .then(([s, p, o, z]) => {
        setStats(s);
        setProducts(p.products || []);
        setOrders(o.orders || []);
        setZones(z.zones || []);
      })
      .finally(() => setLoading(false));
  }, [user, setView]);

  if (!user || user.role !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--dh-green)] border-t-transparent" />
      </div>
    );
  }

  const reloadOrders = () =>
    fetch("/api/admin?action=orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch("/api/admin?action=update-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      toast.success("Estado actualizado");
      reloadOrders();
    }
  };

  const confirmPayment = async (orderId: string) => {
    const res = await fetch("/api/admin?action=confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) {
      toast.success("Pago confirmado");
      reloadOrders();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Panel administrativo
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight md:text-4xl text-[var(--dh-green)]">
          DULCE HABANA · Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Ingresos confirmados"
          value={formatCUP(stats?.revenue || 0)}
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Productos activos"
          value={`${stats?.counts?.activeProducts || 0}`}
          sub={`${stats?.counts?.products || 0} totales`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Órdenes por confirmar"
          value={`${stats?.counts?.pendingOrders || 0}`}
          highlight
        />
        <StatCard
          icon={<Truck className="h-5 w-5" />}
          label="Órdenes totales"
          value={`${stats?.counts?.orders || 0}`}
        />
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="zones">Zonas</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
        </TabsList>

        {/* Orders tab */}
        <TabsContent value="orders" className="space-y-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[var(--dh-green)]">
              Gestión de pedidos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando confirmes el pago por WhatsApp, marca la orden. Cambia el
              estado conforme avanza la entrega.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            <OrderStatCard label="Por confirmar" count={orders.filter((o) => o.status === "PENDING_WHATSAPP").length} />
            <OrderStatCard label="Confirmadas" count={orders.filter((o) => o.status === "CONFIRMED").length} />
            <OrderStatCard label="Preparando" count={orders.filter((o) => o.status === "PREPARING").length} />
            <OrderStatCard label="En camino" count={orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length} />
            <OrderStatCard label="Entregadas" count={orders.filter((o) => o.status === "DELIVERED").length} />
            <OrderStatCard label="Canceladas" count={orders.filter((o) => o.status === "CANCELLED").length} />
          </div>

          <Card className="overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Entrega</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        <div className="flex flex-col items-center gap-2">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                          <p>Aún no hay pedidos</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <p className="font-mono text-xs">{o.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{formatShortDate(o.createdAt)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{o.customerName}</p>
                          <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">
                            {o.items.length} producto(s)
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-32">
                            {o.items.map((i: any) => `${i.quantity}x ${i.productName}`).join(", ")}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCUP(o.total)}
                        </TableCell>
                        <TableCell className="text-xs">
                          <p>{o.deliveryZoneName}</p>
                          <p className="text-muted-foreground line-clamp-1 max-w-32">{o.deliveryAddress}</p>
                          <p className="text-muted-foreground">{o.deliveryTime}</p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              o.status === "DELIVERED" ? "default" :
                              o.status === "PENDING_WHATSAPP" ? "secondary" :
                              o.status === "CANCELLED" ? "outline" : "outline"
                            }
                            className="text-xs"
                          >
                            {ORDER_STATUS[o.status as keyof typeof ORDER_STATUS] || o.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {o.status === "PENDING_WHATSAPP" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => confirmPayment(o.id)}
                                >
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Confirmar pago
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-red-600"
                                  onClick={() => updateOrderStatus(o.id, "CANCELLED")}
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                            {o.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => updateOrderStatus(o.id, "PREPARING")}
                              >
                                Empezar a preparar
                              </Button>
                            )}
                            {o.status === "PREPARING" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => updateOrderStatus(o.id, "OUT_FOR_DELIVERY")}
                              >
                                <Truck className="mr-1 h-3 w-3" />
                                Enviar
                              </Button>
                            )}
                            {o.status === "OUT_FOR_DELIVERY" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => updateOrderStatus(o.id, "DELIVERED")}
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Entregada
                              </Button>
                            )}
                            {/* WhatsApp al cliente */}
                            <a
                              href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center text-xs text-[var(--dh-green)] hover:underline"
                            >
                              <MessageCircle className="mr-1 h-3 w-3" />
                              WhatsApp cliente
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Products tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[var(--dh-green)]">
              Productos del menú
            </h2>
            <NewProductDialog onCreated={() => {
              fetch("/api/admin?action=products")
                .then((r) => r.json())
                .then((d) => setProducts(d.products || []));
            }} />
          </div>

          <Card className="overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Porciones</TableHead>
                    <TableHead>Preparación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          )}
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">{p.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-1.5">
                        <CategoryIcon category={p.category} className="h-3.5 w-3.5" />
                        {CATEGORIES[p.category as keyof typeof CATEGORIES]}
                      </TableCell>
                      <TableCell className="font-medium">{formatCUP(p.price)}</TableCell>
                      <TableCell>{p.portions || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.prepTime ? `${p.prepTime}h` : "Inmediato"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === "ACTIVE" ? "default" : "outline"}
                          className="text-xs"
                        >
                          {PRODUCT_STATUS[p.status as keyof typeof PRODUCT_STATUS] || p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-red-600"
                          onClick={async () => {
                            if (!confirm("¿Desactivar este producto?")) return;
                            await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                            toast.success("Producto desactivado");
                            fetch("/api/admin?action=products")
                              .then((r) => r.json())
                              .then((d) => setProducts(d.products || []));
                          }}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Zones tab */}
        <TabsContent value="zones" className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[var(--dh-green)]">
            Zonas de entrega
          </h2>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zona</TableHead>
                  <TableHead>Tarifa</TableHead>
                  <TableHead>Tiempo estimado</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((z) => (
                  <TableRow key={z.id}>
                    <TableCell className="font-medium">{z.name}</TableCell>
                    <TableCell>{z.fee === 0 ? "Gratis" : formatCUP(z.fee)}</TableCell>
                    <TableCell>{z.estimatedMin > 0 ? `${z.estimatedMin} min` : "Recoger en tienda"}</TableCell>
                    <TableCell>
                      <Badge variant={z.active ? "default" : "outline"} className="text-xs">
                        {z.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[var(--dh-green)]">
            Analítica
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Productos por categoría
              </h3>
              <div className="mt-4 space-y-3">
                {(stats?.byCategory || []).map((c: any) => {
                  const total = stats?.counts?.activeProducts || 1;
                  const pct = (c.count / total) * 100;
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-sm">
                        <span>
                          <span className="flex items-center gap-1.5">
                            <CategoryIcon category={c.category} className="h-3 w-3 inline" />
                            {CATEGORIES[c.category as keyof typeof CATEGORIES] || c.category}
                          </span>
                        </span>
                        <span className="text-muted-foreground">{c.count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[var(--dh-green)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Top productos vendidos
              </h3>
              <div className="mt-4 space-y-3">
                {(stats?.topProducts || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin ventas aún</p>
                ) : (
                  (stats?.topProducts || []).map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>
                        <span className="mr-2 font-bold text-[var(--dh-green)]">#{i + 1}</span>
                        {p.name}
                      </span>
                      <span className="text-muted-foreground">{p.quantity} vendidos</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Ventas mensuales
              </h3>
              <div className="mt-4 space-y-3">
                {(stats?.monthlyData || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin datos suficientes</p>
                ) : (
                  (stats?.monthlyData || []).map((m: any) => {
                    const max = Math.max(...(stats?.monthlyData || []).map((x: any) => x.revenue)) || 1;
                    const pct = (m.revenue / max) * 100;
                    return (
                      <div key={m.month}>
                        <div className="flex justify-between text-sm">
                          <span>{m.month}</span>
                          <span className="text-muted-foreground">
                            {formatCUP(m.revenue)} · {m.orders} orden(es)
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-[var(--dh-green)]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-4 ${highlight ? "bg-amber-50 border-amber-200" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dh-green-light)] text-[var(--dh-green)]">
          {icon}
        </div>
        {highlight && <Clock className="h-4 w-4 text-amber-600" />}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}

function OrderStatCard({ label, count }: { label: string; count: number }) {
  return (
    <Card className="p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-[var(--dh-green)]">{count}</p>
    </Card>
  );
}

function NewProductDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "PANETELAS",
    price: "",
    image: "",
    ingredients: "",
    portions: "",
    prepTime: "0",
    isCombo: false,
    comboItems: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          portions: form.portions ? Number(form.portions) : null,
          prepTime: Number(form.prepTime),
        }),
      });
      if (!res.ok) throw new Error("Error al crear");
      toast.success("Producto creado");
      setForm({
        name: "",
        description: "",
        category: "PANETELAS",
        price: "",
        image: "",
        ingredients: "",
        portions: "",
        prepTime: "0",
        isCombo: false,
        comboItems: "",
      });
      setOpen(false);
      onCreated();
    } catch {
      toast.error("Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo producto</DialogTitle>
          <DialogDescription>
            Añade un dulce al menú de DULCE HABANA.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([k, l]) => (
                    <SelectItem key={k} value={k}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Precio (CUP)</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="portions">Porciones</Label>
              <Input id="portions" type="number" value={form.portions} onChange={(e) => setForm({ ...form, portions: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="prepTime">Tiempo prep (horas)</Label>
              <Input id="prepTime" type="number" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="image">URL de imagen</Label>
            <Input id="image" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ingredients">Ingredientes (separados por coma)</Label>
            <Input id="ingredients" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="mt-1" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isCombo}
              onChange={(e) => setForm({ ...form, isCombo: e.target.checked })}
            />
            Es un combo
          </label>
          {form.isCombo && (
            <div>
              <Label htmlFor="comboItems">Items del combo</Label>
              <Input id="comboItems" placeholder="2 panetelas, 1 flan, 2 bebidas" value={form.comboItems} onChange={(e) => setForm({ ...form, comboItems: e.target.value })} className="mt-1" />
            </div>
          )}
          <Button type="submit" className="w-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]" disabled={loading}>
            {loading ? "Creando..." : "Crear producto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
