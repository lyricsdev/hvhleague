import SteamAuth from "node-steam-openid";
import { getConfig } from "../config/config";

const steam = new SteamAuth({
    realm: `${getConfig().BASEURL}`,
    returnUrl: `${getConfig().BASEURL}/api/auth/steam/authenticate`,
    apiKey: "324873F04B0BCB1834BC9F37A9D92269"
})
export {
    steam
}