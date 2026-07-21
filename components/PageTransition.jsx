"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}
