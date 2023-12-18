import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";

import stylesheet from "~/base.css";
import Layout from "./layout/main.layout";
import { useState, useEffect, createContext } from "react";
import { Socket, io } from "socket.io-client";
import { SocketProvider } from "./components/socket";
import { getUserSession, ret, user } from "./api/user";

export const userContext = createContext<user | undefined>(undefined)

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },

];
export const loader: LoaderFunction = async ({ request, params }) => {
  const url = process.env.WEBSOCKETURL
  let data = await getUserSession(request)
  
  return {
    url,
    User: data
  }
}
export default function App() {
  const [socket, setSocket] = useState<Socket>();
  const {url,User} = useLoaderData<typeof loader>() as {
    url: string,
    User: ret | null,
  }
  useEffect(() => {
    const socket = io(url,{
      auth: {
        "token": User?.token
      }
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("confirmation", (data) => {
      console.log(data);
    });
  }, [socket]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <NextUIProvider>
      <div className="dark text-foreground bg-background">
      <userContext.Provider value={User?.user}>

        <Layout >

        <SocketProvider socket={socket}>
          <Outlet />
        </SocketProvider>

        </Layout>
        </userContext.Provider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </div>
      </NextUIProvider>
      </body>
    </html>
  );
}
