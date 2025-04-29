import Logo from "@/components/Logo";
import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect("/");
  return (
    <div className="auth-layout">
      <div className="flex flex-col gap-2 justify-center items-center">
        <Logo type="full" className="text-6xl md:text-9xl" />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
