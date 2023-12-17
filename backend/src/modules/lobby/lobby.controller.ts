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
    @Post("/joingame/:gameId")
    async joingame(@Param('gameId') id: string,@Body() data :any) {
        
        return await this.manager.joinTeam(data.gameId,"5b4f288e-629a-4638-8442-0614f88b08b9",data.side)
    }
}