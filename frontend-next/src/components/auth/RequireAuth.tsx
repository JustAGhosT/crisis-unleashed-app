"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import type { Route } from "next";
import { Skeleton } from "@/components/ui/skeleton";

interface RequireAuthProps {
  children: React.ReactNode;
  from?: Route;
}

export default function RequireAuth({ children, from }: RequireAuthProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const source = (from ?? (pathname as Route)) || ("/" as Route);
      router.push((`/login?from=${encodeURIComponent(source)}`) as Route);
    }
  }, [status, router, pathname, from]);

  if (status === "loading") {
    return (
      <div className="py-8">
        <Skeleton className="h-10 w-64 mb-6 bg-slate-700" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full bg-slate-700" />
          </div>
          <div>
            <Skeleton className="h-[600px] w-full bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
