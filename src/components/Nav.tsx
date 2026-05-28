import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { selectCartCount, useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";

let shop3dPreloadPromise: Promise<unknown> | null = null;
function preloadShop3D() {
  if (shop3dPreloadPromise) return shop3dPreloadPromise;
  shop3dPreloadPromise = Promise.all([
    import("@/components/archive/Archive3DCanvas"),
    import("@/components/archive/ProductCard3D"),
  ]);
  return shop3dPreloadPromise;
}

export function Nav() {
  const count = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-border/40">
      <Link to="/" className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-foreground">
        Collection 04 / 24
      </Link>
      <Link to="/" className="text-xl md:text-2xl font-display italic font-semibold tracking-tighter text-foreground">
        MAISON NOIR
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        <Link
          to="/shop"
          preload="intent"
          onMouseEnter={() => preloadShop3D()}
          onFocus={() => preloadShop3D()}
          onClick={(e) => {
            if (typeof window !== "undefined" && window.location.pathname === "/shop") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground"
        >
          Shop
        </Link>
        <div className="hidden md:block w-10 h-px bg-foreground/30" />
        <Link to="/about" className="hidden md:inline text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground">
          About
        </Link>
        <Link to="/contact" className="hidden md:inline text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground">
          Contact
        </Link>
        <Link to="/login" className="text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground">
          Login
        </Link>
        <Link
          to="/wishlist"
          className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground"
          aria-label={`Wishlist (${wishlistCount})`}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${wishlistCount > 0 ? "text-red-500" : "text-foreground"}`}
            fill={wishlistCount > 0 ? "currentColor" : "none"}
          />
          <span className="hidden md:inline">Wishlist ({wishlistCount})</span>
          <span className="md:hidden">({wishlistCount})</span>
        </Link>
        <Link to="/cart" className="text-[10px] font-mono uppercase tracking-widest hover:text-accent transition-colors text-foreground">
          Bag ({count})
        </Link>
      </div>
    </nav>
  );
}
