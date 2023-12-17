import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";

import stylesheet from "~/base.css";
import Layout from "./layout/main.layout";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { SocketProvider } from "./components/socket";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },

];

export default function App() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:3002/",{
      auth: {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGVhbWlkIjoiNzY1NjExOTk0MDk5MTYwMDUiLCJpYXQiOjE3MDI4MjcxMTAsImV4cCI6MTcwMjkxMzUxMH0.fu77fyU1VHYjD_8OXZTukl5KkxVTNtAqiwVWzlFp1VY"
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
        <Layout >
        <SocketProvider socket={socket}>
          <Outlet />
        </SocketProvider>
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </div>
      </NextUIProvider>
      </body>
    </html>
  );
}
