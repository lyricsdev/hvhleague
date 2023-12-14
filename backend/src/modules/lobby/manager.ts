import { v4 as uuidv4 } from 'uuid';
import userService from '../user/user.service';
import { Socket } from 'socket.io';
import { createLobby } from './dto/createLobby.dto';
import prisma from '../prisma/prisma.client';

interface RankQueueItem {
    socket: Socket;
    rank: number;
    steamid: string;
}

export default class LobbyManager {
    private userService: userService;

    constructor() {
        this.userService = new userService();
    }
    createLobby = async(userid: string,lobby : createLobby) => {
        const newlobby = await prisma.lobby.create({
            data: {
                mode: lobby.mode,
                finished: false
            }
        })
        await this.userService.addUserToLobby(userid,newlobby.id)
        return {
            lobbyId: newlobby.id
        }
    }
    getLobby = async(gameId: string) => {
        return await prisma.lobby.findFirst({
            where: {
                id: gameId
            },
            select: {
                id: true,
                ctPlayers: {
                    select: {
                        steamID: true
                    }
                },
                tPlayers: {
                    select: {
                        steamID: true
                    }
                },
                mode: true,
                map: true
            }
        })
    }
}