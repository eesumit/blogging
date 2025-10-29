'use client'
import { AiFillHome,AiOutlineHome } from "react-icons/ai";
import { FaUserCircle,FaRegUserCircle  } from "react-icons/fa";
import { RiDashboardFill,RiDashboardLine  } from "react-icons/ri";
import { IoNotificationsSharp,IoNotificationsOutline  } from "react-icons/io5";
import { IoIosAddCircle,IoIosAddCircleOutline  } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from "./ModeToggle";
const SideNavbar = () => {
    const path = usePathname();
  return (
    <div className='w-full h-full py-10'>
        <div className='h-1/6 w-full bg-red-300 flex justify-center items-center text-7xl font-bold' >
        Blog.
        </div>
        <nav>
            <ul className="flex flex-col justify-center py-10 gap-2">
                <li className="pl-10 rounded-sm mx-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                        <Link href={"/home"} className="">
                            <span className='flex justify-start items-center px-auto py-3 gap-3'>{path === "/home" ? <AiFillHome /> : <AiOutlineHome />}
                            <span className={path === "/home" ? "font-semibold" : ""}>Home</span></span>
                        </Link>
                    </li>
                <li className="pl-10 rounded-sm mx-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <Link href={"/create"} className="">
                        <span className='flex justify-start items-center px-auto py-3 gap-3'>{path==="/create"?<IoIosAddCircle/>:<IoIosAddCircleOutline />}
                        <span className={path === "/create" ? "font-semibold" : ""}>Create</span></span>
                    </Link>
                </li>
                <li className="pl-10 rounded-sm mx-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <Link href={"/notifications"} className="">
                        <span className='flex justify-start items-center px-auto py-3 gap-3'>{path==="/notifications"?<IoNotificationsSharp/>:<IoNotificationsOutline />}
                        <span className={path === "/notifications" ? "font-semibold" : ""}>Notifications</span></span>
                    </Link>
                </li>
                <li className="pl-10 rounded-sm mx-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <Link href={"/dashboard"} className="">
                        <span className='flex justify-start items-center px-auto py-3 gap-3'>{path==="/dashboard"?<RiDashboardFill/>:<RiDashboardLine/>}
                        <span className={path === "/dashboard" ? "font-semibold" : ""}>Dashboard</span></span>
                    </Link>
                </li>
                <li className="pl-10 rounded-sm mx-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <Link href={"/profile"} className="">
                        <span className='flex justify-start items-center px-auto py-3 gap-3'>{path==="/profile"?<FaUserCircle/>:<FaRegUserCircle/>}
                        <span className={path === "/profile" ? "font-semibold" : ""}>Profile</span></span>
                    </Link>
                </li>
            </ul>
        </nav>
        <div className="absolute bottom-20 w-full flex items-center p-5 gap-2">
            <BiLogOutCircle 
              className="border-2 border-gray-200 w-6 h-6 rounded-full cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => signOut({ callbackUrl: '/login' })}
            />
            <ModeToggle />
        </div>
    </div>
  )
}

export default SideNavbar