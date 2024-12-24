import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/QueriesAndMutation";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
    const {mutate:signOut, isSuccess} = useSignOutAccount();
    const {user} = useUserContext()
    const navigate = useNavigate();

    useEffect(()=>{
        if(isSuccess) navigate(0);
    },[isSuccess])
  return (
    <nav className="leftsidebar">
        <div>
            <Link to = "/" className="flex gap-3 items-center">
                <img 
                    src="/assets/images/logo.svg" 
                    alt="logo"
                    width={130}
                    height={325}
                />
            </Link>

            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                <img 
                  src={user.imageUrl || "/public/assets/icons/profile-placeholder.svg"} 
                  
                  alt="profile"
                  className="h-8 w-8 rounded-full" 
                />
                <div className="flex flex-col">
                    <p className="body-bold">
                        {user.name}
                    </p>
                    <p className="small-regular text-light-3">
                        @${user.username}
                    </p>
                </div>
            </Link>

            <ul className="flex flex-col gap-6">
                {sidebarLinks.map((link:INavLink) => {
                    return (
                        <li key={link.label} className="leftsidebar-link">
                            <NavLink to={link.route} className="flex gap-4 items-center p-4">
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    </nav>
  )
}

export default LeftSidebar