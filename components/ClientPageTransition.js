'use client';

import dynamic from "next/dynamic";

const PageTransition = dynamic(() => import("@/components/PageTransition"), {
    ssr: false,
});

export default function ClientPageTransition({ children }) {
    return <PageTransition>{children}</PageTransition>;
}