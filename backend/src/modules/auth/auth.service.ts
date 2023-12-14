import { Request } from "express";
import userService from "../user/user.service";
import { steam } from "../../utils/steam";
import { NotFoundError } from "routing-controllers";
import { authenticateDto } from "./dto/authenticate.dto";
import { comparePasswords } from "../../utils/password";
import wrongPassword from "../../utils/wrongPassword";
import jwt from 'jsonwebtoken';
import { getConfig } from "./../../config/config";

export default class AuthService {
    private userService: userService;
  
    constructor() {
      this.userService = new userService();
    }
  
    authorize = async (request: Request) => {
        const user = await steam.authenticate(request);
        const siteUser = await this.userService.findUserBySteamId(user.steamid);
        
        if (!siteUser) {
          await this.register(user.steamid, user.profile);
        }
        
        const token = jwt.sign({ steamid: user.steamid },  getConfig().JWTTOKEN, { expiresIn: '24h' });
        console.log(token)
        return { token };
      };
    register = async (steamid: string, profileurl: string) => {
        await this.userService.createUserSteam({ steamid, profileurl });
    
        const token = jwt.sign({ steamid },  getConfig().JWTTOKEN, { expiresIn: '24h' });
        return { token };
      };
      authenticate = async (data: authenticateDto) => {
        const user = await this.userService.getUser(data.steamid);
        if (user) {
          const compared = await comparePasswords(data.password, user.password);
          if (compared) {
            const token = jwt.sign({ steamid: user.steamID },  getConfig().JWTTOKEN, { expiresIn: '24h' });
            return { token };
          }
          return new wrongPassword("Password is wrong");
        }
        return new NotFoundError("User was not found.");
      };
  }