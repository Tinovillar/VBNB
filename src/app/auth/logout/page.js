"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/");
    };
    doLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Cerrando sesión...</p>
    </div>
  );
}
