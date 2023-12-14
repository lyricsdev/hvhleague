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
import LobbyManager from "./manager";
@JsonController("/games")
export class LobbyController {
    private manager: LobbyManager
    constructor() {
        this.manager = new LobbyManager()
    }
    @Get("/:id")
    async gamesget(@Param('id') id: string) {
        return await this.manager.getLobby(id)
    }
    @Get("/b/:id")
    async ga1mesget(@Param('id') id: string) {
        console.log("1235")
        return await this.manager.getLobby(id)
    }
}