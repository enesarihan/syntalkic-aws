import Link from "next/link";
import { ModeToggle } from "./Mode-toggle";
import Logo from "./Logo";

import UserButton from "./UserButton";
const Navbar = async () => {
  return (
    <nav className="flex justify-between">
      <Link href={"/"} className="flex items-center gap-2">
        <Logo type="full" className="" />
      </Link>
      <div className="flex flex-row gap-2">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
