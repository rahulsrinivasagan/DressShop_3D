import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatINR } from "@/lib/currency";
import { selectCartSubtotal, useCartStore } from "@/stores/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Bag — MAISON NOIR" }, { name: "description", content: "Your bag." }],
  }),
  component: Cart,
});

function Cart() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const navigate = useNavigate();
  const steps = ["Bag", "Shipping", "Payment"];

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 px-6 md:px-12 pb-32">
        <div className="flex items-center gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest ${
                  i === 0 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")} / {s}
              </span>
              {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>

        <h1 className="text-5xl md:text-8xl font-display italic mb-16">Your Bag</h1>

        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <p className="text-2xl md:text-4xl font-display italic">Your Bag is Empty</p>
            <Link
              to="/shop"
              className="mt-8 px-12 py-5 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {items.map((it, i) => (
              <motion.div
                key={`${it.id}::${it.size ?? ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex gap-6 border-b border-border pb-8"
              >
                <div className="w-32 h-40 overflow-hidden bg-card flex-shrink-0">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={400}
                    height={500}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-tight font-medium">{it.name}</p>
                    <p className="text-[10px] font-mono uppercase text-muted-foreground mt-1">
                      Size {it.size ?? "36"}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => decrement(it.id, it.size)}
                        className="text-xs"
                      >
                        −
                      </button>
                      <span className="text-xs font-mono">{it.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => increment(it.id, it.size)}
                        className="text-xs"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono text-sm">{formatINR(it.price * it.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <aside className="lg:col-span-4 bg-card p-8 h-fit border border-border space-y-6">
            <h3 className="text-xl font-display italic">Order Summary</h3>
            <div className="space-y-3 text-[11px] font-mono uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-foreground text-sm">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: "/checkout" })}
              className="w-full py-4 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="block text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Continue Browsing
            </Link>
          </aside>
        </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
