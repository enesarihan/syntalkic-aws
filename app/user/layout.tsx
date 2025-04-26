import Navbar from "@/components/Navbar";

const UserLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="root-layout">
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
