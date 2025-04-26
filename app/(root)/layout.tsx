import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const RootLayouts = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout">
      <Navbar />
      {children}
    </div>
  );
};

export default RootLayouts;
