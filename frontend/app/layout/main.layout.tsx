import React, { useState, useEffect } from "react"

import { useContext } from "react";
import Headers from "./header";
import { ToastContainer } from "react-toastify";
import Header from "./header";
import Main from "./main";
import { userContext } from "~/root";
import { user } from "~/api/user";
import { Player } from "~/api/interfaces";


interface LayoutProp {
  children: React.ReactNode;
  user?: user | null
  members: Player[]
};



const Layout: React.FC<LayoutProp> = ({ children,members,user }: LayoutProp) => {
  return <div>
    <Header members={members} />
    <Main>
      {children}
    </Main>
  </div>
}
export default Layout