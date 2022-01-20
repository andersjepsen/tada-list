import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Sidebar } from "../ui/Sidebar";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const isHome = useMemo(() => {
    return router.asPath === "/";
  }, [router]);

  console.log({ isHome });
  return (
    <div className="flex min-h-screen">
      <div
        className={`${
          isHome ? "block" : "hidden md:block"
        } w-full md:w-1/3 lg:w-1/4 xl:w-64`}
      >
        <Sidebar />
      </div>
      <section
        className={`${
          isHome ? "hidden md:block" : "block"
        } flex-1 lg:max-w-2xl xl:max-w-3xl lg:m-auto h-screen overflow-y-scroll p-4`}
      >
        {children}
      </section>
    </div>
  );
}

export { SidebarLayout };
