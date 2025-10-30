'use client';
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FaUserCircle, FaRegUserCircle } from "react-icons/fa";
import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import { IoNotificationsSharp, IoNotificationsOutline } from "react-icons/io5";
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

export default function MobileNavbar() {
  const path = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 shadow-lg">
      {/* Home */}
      <Link href="/home" className="flex flex-col items-center text-xl">
        {path === "/home" ? <AiFillHome /> : <AiOutlineHome />}
      </Link>

      {/* Create */}
      <Link href="/create" className="flex flex-col items-center text-xl">
        {path === "/create" ? <IoIosAddCircle /> : <IoIosAddCircleOutline />}
      </Link>

      {/* Notifications */}
      <Link href="/notifications" className="flex flex-col items-center text-xl">
        {path === "/notifications" ? <IoNotificationsSharp  /> : <IoNotificationsOutline />}
      </Link>

      {/* Dashboard */}
      <Link href="/dashboard" className="flex flex-col items-center text-xl">
        {path === "/dashboard" ? <RiDashboardFill /> : <RiDashboardLine />}
      </Link>

      {/* Profile */}
      <Link href="/profile" className="flex flex-col items-center text-xl">
        {path === "/profile" ? <FaUserCircle /> : <FaRegUserCircle />}
      </Link>

      {/* Logout */}
      <BiLogOutCircle
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xl cursor-pointer hover:text-amber-400 transition-colors"
      />
      <ModeToggle/>
    </div>
  );
}
