import React, { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import Menu from "./Menu";
import TopNav from "./TopNav"
import UserMenu from "./UserMenu";

function Nav() {
    const user = useContext(UserContext);
    return (
        <>
            <TopNav />
            {user.role == 'super-admin' ? <Menu /> : <UserMenu />}
        </>
    )
}

export default (Nav)