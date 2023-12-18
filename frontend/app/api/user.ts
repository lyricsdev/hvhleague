import { redirect } from "@remix-run/node";
import * as jwt from "jwt-decode"
import { authenticator } from "./auth";
import { useAxios } from "./fetcher";
export interface user {
    id: string
    steamid : string
    
}

export interface ret {
    user: user,
    token: string
}
const getUserSession = async (request: Request): Promise<ret | null> => {
    let user = await authenticator.isAuthenticated(request);

    if (user) {
        const usr = jwt.jwtDecode(user) as user;
        await useAxios.setUserToken(user)
        return {
            user: usr,
            token: user
        }
    } 
    return null
}

export {
    getUserSession,
}