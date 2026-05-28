import { useEffect, useState } from "react";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 4;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        gap: "2rem",
      }}
    >
      <svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: "dressPulse 1.5s ease-in-out infinite",
          transformOrigin: "center",
        }}
      >
        <style>{`
          @keyframes dressPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}</style>
        <path d="M30 8 Q40 2 50 8" stroke="#c8b08a" strokeWidth="2" fill="none" />
        <path d="M20 14 Q30 8 50 8 Q60 14 62 24" stroke="#c8b08a" strokeWidth="2" fill="none" />
        <path
          d="M20 14 L18 38 Q28 42 40 42 Q52 42 62 38 L60 14"
          stroke="#c8b08a"
          strokeWidth="1.5"
          fill="#c8b08a"
          fillOpacity="0.15"
        />
        <line x1="18" y1="38" x2="62" y2="38" stroke="#c8b08a" strokeWidth="1" opacity="0.5" />
        <path
          d="M18 38 Q10 60 6 95 Q23 98 40 98 Q57 98 74 95 Q70 60 62 38 Q52 42 40 42 Q28 42 18 38Z"
          stroke="#c8b08a"
          strokeWidth="1.5"
          fill="#c8b08a"
          fillOpacity="0.12"
        />
        <path d="M30 42 Q22 65 18 95" stroke="#c8b08a" strokeWidth="0.8" opacity="0.4" />
        <path d="M40 42 Q40 65 40 95" stroke="#c8b08a" strokeWidth="0.8" opacity="0.4" />
        <path d="M50 42 Q58 65 62 95" stroke="#c8b08a" strokeWidth="0.8" opacity="0.4" />
      </svg>

      <p
        style={{
          color: "#c8b08a",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: "serif",
        }}
      >
        Loading
      </p>

      <div
        style={{
          width: "120px",
          height: "1px",
          background: "#222",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#c8b08a",
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}

