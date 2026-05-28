import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatINR } from "@/lib/currency";
import { selectCartSubtotal, useCartStore } from "@/stores/cart";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — MAISON NOIR" }, { name: "description", content: "Checkout." }],
  }),
  component: Checkout,
});

type Address = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

const emptyForm = (): Omit<Address, "id"> => ({
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
});

function AddressModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Address | null;
  onSave: (data: Omit<Address, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>(
    initial
      ? { name: initial.name, line1: initial.line1, line2: initial.line2 ?? "", city: initial.city, state: initial.state, zip: initial.zip, phone: initial.phone }
      : emptyForm()
  );

  const field = (key: keyof typeof form) => ({
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSave = () => {
    if (!form.name || !form.line1 || !form.city || !form.state || !form.zip || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onSave(form);
  };

  const inputCls =
    "w-full bg-transparent border border-border rounded-none px-4 py-3 text-xs font-mono uppercase tracking-widest placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="fixed inset-0 z-[120] bg-background/70 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="w-full max-w-lg border border-border bg-card p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display italic">
            {initial ? "Edit Address" : "Add Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <input {...field("name")} placeholder="Full Name *" className={inputCls} />
          <input {...field("phone")} placeholder="Phone Number *" className={inputCls} />
          <input {...field("line1")} placeholder="Address Line 1 *" className={inputCls} />
          <input {...field("line2")} placeholder="Address Line 2 (optional)" className={inputCls} />
          <div className="grid grid-cols-2 gap-4">
            <input {...field("city")} placeholder="City *" className={inputCls} />
            <input {...field("state")} placeholder="State *" className={inputCls} />
          </div>
          <input {...field("zip")} placeholder="PIN Code *" className={inputCls} />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
        >
          {initial ? "Save Changes" : "Add Address"}
        </button>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((s) => s.clear);

  const [payment, setPayment] = useState<"upi" | "card" | "netbanking" | "cod" | "">("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const shippingFee = 199;
  const gst = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const total = subtotal + shippingFee + gst;

  const openAdd = () => {
    setEditingAddress(null);
    setModalMode("add");
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setModalMode("edit");
  };

  const handleDelete = (id: string) => {
    setAddresses((a) => a.filter((addr) => addr.id !== id));
    if (selectedAddressId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      setSelectedAddressId(remaining[0]?.id ?? null);
    }
    toast.success("Address removed.");
  };

  const handleSave = (data: Omit<Address, "id">) => {
    if (modalMode === "edit" && editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? { ...data, id: editingAddress.id } : a))
      );
      toast.success("Address updated.");
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => [...prev, { ...data, id }]);
      setSelectedAddressId(id);
      toast.success("Address added.");
    }
    setModalMode(null);
    setEditingAddress(null);
  };

  const payNow = () => {
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please add and select a delivery address.");
      return;
    }
    if (!payment) {
      toast.error("Please select a payment method.");
      return;
    }
    toast.success("Order placed successfully");
    clearCart();
    setTimeout(() => navigate({ to: "/" }), 800);
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <section className="pt-32 px-6 md:px-12 pb-32">
        <h1 className="text-5xl md:text-8xl font-display italic mb-16">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-10">
            {/* Delivery Address */}
            <div className="border border-border bg-card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display italic">Delivery Address</h3>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-5 py-2 rounded-full border border-border text-[10px] font-mono uppercase tracking-widest hover:border-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 && (
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                  No addresses saved. Add one to continue.
                </p>
              )}

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative w-full text-left border rounded-lg p-6 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {selectedAddressId === addr.id && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-accent flex items-center gap-1">
                              <Check className="h-3 w-3" /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm uppercase tracking-tight font-medium">{addr.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                          <br />
                          {addr.city}, {addr.state} {addr.zip}
                          <br />
                          {addr.phone}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          aria-label="Edit address"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(addr);
                          }}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-foreground transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          aria-label="Delete address"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(addr.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-foreground transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping List */}
            <div className="space-y-6">
              <h3 className="text-xl font-display italic">Shopping List</h3>
              <div className="space-y-6">
                {items.map((it) => (
                  <div key={`${it.id}::${it.size ?? ""}`} className="flex gap-6 border-b border-border pb-6">
                    <div className="w-24 h-32 overflow-hidden bg-card flex-shrink-0">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={400}
                        height={500}
                      />
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="text-sm uppercase tracking-tight font-medium">{it.name}</p>
                        <p className="text-[10px] font-mono uppercase text-muted-foreground mt-1">
                          Size {it.size ?? "—"} / Qty {it.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-sm">{formatINR(it.price * it.quantity)}</span>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-2xl font-display italic">Your Bag is Empty</p>
                    <Link
                      to="/shop"
                      className="inline-block mt-8 px-12 py-5 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="border border-border bg-card p-8 space-y-6">
              <h3 className="text-xl font-display italic">Payment</h3>
              <div className="space-y-4 text-[10px] font-mono uppercase tracking-widest">
                {[
                  { id: "upi", label: "UPI" },
                  { id: "card", label: "Card" },
                  { id: "netbanking", label: "Net Banking" },
                  { id: "cod", label: "Cash on Delivery" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center justify-between gap-4 border border-border rounded-full px-5 py-3 hover:border-foreground transition-colors cursor-pointer"
                  >
                    <span>{m.label}</span>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id as typeof payment)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-4 bg-card p-8 h-fit border border-border space-y-6">
            <h3 className="text-xl font-display italic">Order Summary</h3>
            <div className="space-y-3 text-[11px] font-mono uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span>{formatINR(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST</span>
                <span>{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-foreground text-sm">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={payNow}
              className="w-full py-4 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Pay Now — {formatINR(total)}
            </button>

            <Link
              to="/cart"
              className="block text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Back to Bag
            </Link>
          </aside>
        </div>
      </section>

      {modalMode && (
        <AddressModal
          initial={editingAddress}
          onSave={handleSave}
          onClose={() => {
            setModalMode(null);
            setEditingAddress(null);
          }}
        />
      )}

      <Footer />
    </main>
  );
}
