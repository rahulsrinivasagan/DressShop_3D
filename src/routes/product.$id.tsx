import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getProduct, products } from "@/data/products";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/stores/cart";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist";
import { toast } from "sonner";
import { ProductViewer3D } from "@/components/archive/ProductViewer3D";
import { Archive3DCanvas } from "@/components/archive/Archive3DCanvas";
import { ProductCard3D } from "@/components/archive/ProductCard3D";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — MAISON NOIR` },
      { name: "description", content: loaderData?.product.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-display italic">Not in the archive.</h1>
        <Link
          to="/shop"
          className="text-[10px] font-mono uppercase tracking-widest border-b border-foreground pb-1"
        >
          Return to Shop
        </Link>
      </div>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState("36");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.hex ?? "#e8e4dc");
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const sizes = ["34", "36", "38", "40", "42"];
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const eventSourceRef = useRef<HTMLDivElement>(null!);

  const [relatedColors, setRelatedColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(related.map((p) => [p.id, p.colors[0]?.hex ?? "#e8e4dc"])),
  );

  const clickGuards = useMemo(() => {
    const map = new Map<
      string,
      {
        moved: boolean;
        startX: number;
        startY: number;
        pointerDown: boolean;
      }
    >();

    const get = (id: string) => {
      const existing = map.get(id);
      if (existing) return existing;
      const state = { moved: false, startX: 0, startY: 0, pointerDown: false };
      map.set(id, state);
      return state;
    };

    return {
      onPointerDown: (id: string, e: React.PointerEvent) => {
        const st = get(id);
        st.pointerDown = true;
        st.moved = false;
        st.startX = e.clientX;
        st.startY = e.clientY;
      },
      onPointerMove: (id: string, e: React.PointerEvent) => {
        const st = get(id);
        if (!st.pointerDown) return;
        const dx = Math.abs(e.clientX - st.startX);
        const dy = Math.abs(e.clientY - st.startY);
        if (dx + dy > 6) st.moved = true;
      },
      onPointerUp: (id: string) => {
        const st = get(id);
        st.pointerDown = false;
      },
      shouldCancelClick: (id: string) => {
        const st = get(id);
        return st.moved;
      },
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main ref={eventSourceRef} className="min-h-screen bg-background text-foreground">
      {mounted ? <Archive3DCanvas eventSource={eventSourceRef} /> : null}
      <Nav />
      <section className="pt-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 lg:sticky lg:top-32 self-start"
        >
          <div className="aspect-[3/4] overflow-hidden bg-card relative">
            {mounted ? (
              <ProductViewer3D model={product.model} colorHex={selectedColor} className="absolute inset-0" />
            ) : (
              <div className="absolute inset-0">
                <div className="w-full h-full bg-card" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/25" />
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
              </div>
            )}
            <button
              aria-label="Toggle wishlist"
              onClick={() => {
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  size,
                });

                if (!wishlisted) {
                  toast.success("Added to wishlist", {
                    description: product.name,
                    duration: 3000,
                  });
                } else {
                  toast("Removed from wishlist", { duration: 2000 });
                }
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-border bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${wishlisted ? "text-red-500" : "text-foreground"}`}
                fill={wishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 lg:pl-12 flex flex-col gap-8 lg:pt-20"
        >
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-display italic leading-tight">
              {product.name}
            </h1>
            <p className="font-mono text-sm">{formatINR(product.price)}</p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
            {product.description}
          </p>

          <div className="space-y-3 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Size
            </span>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 border text-xs font-mono transition-all ${
                    size === s
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Color
            </span>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => {
                const active = selectedColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    aria-label={`Select ${c.name}`}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`h-5 w-5 rounded-full border transition-all duration-300 ease-[var(--ease-cinema)] ${
                      active
                        ? "border-foreground ring-2 ring-foreground/20 scale-110"
                        : "border-border hover:border-foreground/60"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
              });
              toast.success(`${product.name} added to bag`, {
                description: `Size ${size} · ${formatINR(product.price)}`,
                action: { label: "View Bag", onClick: () => window.location.href = "/cart" },
              });
            }}
            className="mt-4 px-10 py-5 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors w-full md:w-auto"
          >
            Add to Bag — {formatINR(product.price)}
          </button>

          <div className="border-t border-border pt-8 space-y-4 mt-4">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-muted-foreground">Fabric</span>
              <span>{product.fabric}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-muted-foreground">Origin</span>
              <span>Chennai Atelier</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-muted-foreground">Lead Time</span>
              <span>4–6 Weeks</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <h3 className="text-3xl md:text-5xl font-display italic mb-12">You may also study</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block">
              <div
                className="aspect-[3/4] overflow-hidden bg-card relative"
                onPointerDown={(e) => clickGuards.onPointerDown(p.id, e)}
                onPointerMove={(e) => clickGuards.onPointerMove(p.id, e)}
                onPointerUp={() => clickGuards.onPointerUp(p.id)}
                onClick={(e) => {
                  if (clickGuards.shouldCancelClick(p.id)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <ProductCard3D
                  model={p.model}
                  colorHex={relatedColors[p.id] ?? p.colors[0]?.hex ?? "#e8e4dc"}
                  className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-4 flex justify-between text-xs">
                <div>
                  <span className="uppercase tracking-tight">{p.name}</span>
                  <div className="mt-3 flex items-center gap-2">
                    {p.colors.map((c) => {
                      const active = (relatedColors[p.id] ?? p.colors[0]?.hex) === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          aria-label={`Select ${c.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setRelatedColors((prev) => ({ ...prev, [p.id]: c.hex }));
                          }}
                          className={`h-4 w-4 rounded-full border transition-all duration-300 ease-[var(--ease-cinema)] ${
                            active
                              ? "border-foreground ring-2 ring-foreground/20 scale-110"
                              : "border-border hover:border-foreground/60"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
                <span className="font-mono">{formatINR(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
