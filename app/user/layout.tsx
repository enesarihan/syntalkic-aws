import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

const UserLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");
  return (
    <div className="root-layout">
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
