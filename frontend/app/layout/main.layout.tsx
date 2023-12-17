import React, { useState, useEffect } from "react"

import userContext from "~/root"
import { useContext } from "react";
import Headers from "./header";
import { ToastContainer } from "react-toastify";


interface LayoutProp {
  children: React.ReactNode;
};



const Layout: React.FC<LayoutProp> = ({ children }: LayoutProp) => {
  return <div>
            {children}

  </div>
}
export default Layout