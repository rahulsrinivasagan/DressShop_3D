import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { formatINR } from "@/lib/currency";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist";
import { toast } from "sonner";

const Archive3DCanvas = lazy(() =>
  import("@/components/archive/Archive3DCanvas").then((m) => ({ default: m.Archive3DCanvas })),
);
const ProductCard3D = lazy(() =>
  import("@/components/archive/ProductCard3D").then((m) => ({ default: m.ProductCard3D })),
);

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — MAISON NOIR" },
      {
        name: "description",
        content: "Browse the MAISON NOIR collection of hand-draped silk and architectural tailoring.",
      },
    ],
  }),
  component: Shop,
});

const categories = ["All", "Evening", "Tailoring", "Outerwear", "Archive"];

function Shop() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? products : products.filter((p) => p.category === cat);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlistItems = useWishlistStore((s) => s.items);
  const eventSourceRef = useRef<HTMLDivElement>(null!);
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (cancelled) return;
      setEnable3d(true);
    };

    const g = globalThis as any;

    if (g && typeof g.requestIdleCallback === "function") {
      const id = g.requestIdleCallback(enable, { timeout: 1200 });
      return () => {
        cancelled = true;
        g.cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(enable, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.colors[0]?.hex ?? "#e8e4dc"])),
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

  return (
    <main ref={eventSourceRef} className="min-h-screen bg-background text-foreground">
      {enable3d ? (
        <Suspense fallback={null}>
          <Archive3DCanvas eventSource={eventSourceRef} />
        </Suspense>
      ) : null}
      <Nav />
      <section className="pt-40 pb-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Collection 04 / 24</span>
          <h1 className="text-6xl md:text-9xl font-display italic mt-6 leading-[0.9]">The Archive</h1>
        </motion.div>

        <div className="mt-16 flex gap-2 md:gap-6 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full border text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-all ${
                cat === c
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
        {filtered.map((p, i) => {
          const wishlisted = wishlistItems.some((it) => it.id === p.id);
          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={i % 3 === 1 ? "lg:translate-y-24" : ""}
            >
              <Link to="/product/$id" params={{ id: p.id }} className="block group">
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
                {enable3d ? (
                  <Suspense fallback={<ProductCardFallback image={p.image} />}>
                    <ProductCard3D
                      model={p.model}
                      colorHex={selectedColors[p.id] ?? p.colors[0]?.hex ?? "#e8e4dc"}
                      className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </Suspense>
                ) : (
                  <ProductCardFallback image={p.image} />
                )}
                <button
                  aria-label="Toggle wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist({ id: p.id, name: p.name, price: p.price, image: p.image });
                    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
                      description: p.name,
                      duration: 2000,
                    });
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-border bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${wishlisted ? "text-red-500" : "text-foreground"}`}
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <div className="pt-5 flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-tight font-medium">{p.name}</p>
                  <p className="text-[10px] font-mono uppercase text-muted-foreground mt-1">{p.category}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {p.colors.map((c) => {
                      const active = (selectedColors[p.id] ?? p.colors[0]?.hex) === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          aria-label={`Select ${c.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedColors((prev) => ({ ...prev, [p.id]: c.hex }));
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
                <span className="font-mono text-[10px]">{formatINR(p.price)}</span>
              </div>
            </Link>
            </motion.div>
          );
        })}
      </section>
      <Footer />
    </main>
  );
}

function ProductCardFallback({ image }: { image: string }) {
  return (
    <div className="absolute inset-0">
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-90 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/25" />
    </div>
  );
}
