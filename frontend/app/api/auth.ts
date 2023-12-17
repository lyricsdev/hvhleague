import { createCookieSessionStorage } from "@remix-run/node";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "token", 
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "test",
  },
});
export let { getSession, commitSession, destroySession } = sessionStorage;
import { Authenticator } from "remix-auth";
export const authenticator = new Authenticator<string>(sessionStorage);