import {
    JsonController,
    Authorized,
    Post,
    Body,
    Get,
    Req,
    Param,
    getMetadataArgsStorage,
  } from "routing-controllers";
import { steam } from "../../utils/steam";
import AuthService from "./auth.service";
import { Request } from "express";
import { authenticateDto } from "./dto/authenticate.dto";
@JsonController("/auth")
export class authController {
    private AuthService: AuthService
    constructor() {
        this.AuthService = new AuthService()
    }
    @Get("/steam")
    async steamAuth() {
        const redirectUrl = await steam.getRedirectUrl();
        return {
            url: redirectUrl
        }
    }
    @Get("/steam/authenticate")
    async steamAuthenticate(@Req() request : Request) {
        try {
            const user = await this.AuthService.authorize(request)
            return user
        } catch (error) {
            return {error: "something wrong"}
        }
    }
    @Post("/authenticate")
    async authenticate(@Body() body: authenticateDto) {
        return await this.AuthService.authenticate(body)
    }
}