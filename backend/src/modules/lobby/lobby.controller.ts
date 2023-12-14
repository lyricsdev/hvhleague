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
   
}