import Link from "next/link";
import { ModeToggle } from "./Mode-toggle";
import SignOutButton from "./Sign-Out-Button";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/actions/auth.actions";
const Navbar = async () => {
  const user = await getCurrentUser();
  return (
    <nav className="flex justify-between">
      <Link href={"/"} className="flex items-center gap-2">
        <Logo type="full" className="" />
      </Link>
      <div className="flex flex-row gap-2">
        <Link
          href={`/user/${user?.id}`}
          className="text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          Profile
        </Link>
        <ModeToggle />
        <SignOutButton userName={user?.name || ""} />
      </div>
    </nav>
  );
};

export default Navbar;
