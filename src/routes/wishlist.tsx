import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatINR } from "@/lib/currency";
import { useWishlistStore } from "@/stores/wishlist";
import { useCartStore } from "@/stores/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — MAISON NOIR" },
      { name: "description", content: "Your saved pieces." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const moveToCart = (item: typeof items[number]) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, size: item.size });
    removeFromWishlist(item.id);
    toast.success(`${item.name} moved to bag`);
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 px-6 md:px-12 pb-32">
        <h1 className="text-5xl md:text-8xl font-display italic mb-16">Wishlist</h1>

        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Heart className="h-12 w-12 mb-6 text-muted-foreground" />
            <p className="text-2xl md:text-4xl font-display italic">Your Wishlist is Empty</p>
            <Link
              to="/shop"
              className="mt-8 px-12 py-5 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group flex flex-col"
              >
                <Link to="/product/$id" params={{ id: item.id }} className="block">
                  <div className="aspect-[3/4] overflow-hidden bg-card relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      loading="lazy"
                      width={600}
                      height={800}
                    />
                  </div>
                </Link>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm uppercase tracking-tight font-medium">{item.name}</p>
                      {item.size && (
                        <p className="text-[10px] font-mono uppercase text-muted-foreground mt-1">
                          Size {item.size}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-sm">{formatINR(item.price)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 py-3 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors"
                    >
                      Move to Bag
                    </button>
                    <button
                      aria-label="Remove from wishlist"
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.success(`${item.name} removed from wishlist`);
                      }}
                      className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-foreground transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
