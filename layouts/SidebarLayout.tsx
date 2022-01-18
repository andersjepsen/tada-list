import React from "react";
import { Sidebar } from "../ui/Sidebar";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="flex-1 h-screen overflow-y-scroll p-4">
        {children}
      </section>
    </div>
  );
}

export { SidebarLayout };
