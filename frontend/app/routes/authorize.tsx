import { redirect, ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator, commitSession, getSession } from "~/api/auth";
import { useAxios } from "~/api/fetcher";


export const loader : LoaderFunction= async ({ request, params,context }) => {
    const url = new URL(request.url)
    const data = await useAxios.get<any>(`/auth/steam/authenticate${url.search}`)
    if(data?.token) {
        let session = await getSession(request.headers.get("cookie"));
        session.set(authenticator.sessionKey, data.token);
        let headers = new Headers({ "Set-Cookie": await commitSession(session) });
        return await redirect("/", { headers });
    }
    return await redirect("/")
};