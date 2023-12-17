import { v4 as uuidv4 } from 'uuid';
import userService from '../user/user.service';
import { Socket } from 'socket.io';
import { createLobby } from './dto/createLobby.dto';
import prisma from '../prisma/prisma.client';
import { Mode } from '@prisma/client';

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
    createLobby = async (userid: string, lobby: createLobby) => {
        const newlobby = await prisma.lobby.create({
            data: {
                mode: lobby.mode,
                finished: false
            }
        })
        await this.userService.addUserToLobby(userid, newlobby.id)
        return {
            lobbyId: newlobby.id
        }
    }
    getLobby = async (gameId: string) => {
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
    joinTeam = async (gameId: string, playerId: string, side: "t side" | "ct side") => {
        switch (side) {
            case 'ct side': {
                const lobby = await prisma.lobby.findUnique({
                    where: {
                        id: gameId,
                        finished: false
                    }
                });

                if (lobby) {
                    const maxPlayersPerTeam = lobby.mode === Mode.FIVE_VS_FIVE ? 5 : 2;
                    {
                        const countLobbyCt = await prisma.users.count({
                            where: {
                                ctLobbies: {
                                    some: {
                                        id: gameId
                                    }
                                }
                            }
                        });

                        console.log(`Count of CT players in lobby ${gameId}: ${countLobbyCt}`);

                        if (countLobbyCt < maxPlayersPerTeam) {
                            const isPlayerInLobby = await prisma.users.findFirst({
                                where: {
                                    AND: [
                                        { id: playerId },
                                        {
                                            OR: [
                                                { ctLobbies: { none: { id: gameId } } }, 
                                                { ctLobbies: { some: { finished: true } } } 
                                            ]
                                        }
                                    ]
                                }
                            });

                            if (isPlayerInLobby) {
                                await prisma.users.update({
                                    where: {
                                        id: playerId
                                    },
                                    data: {
                                        ctLobbies: {
                                            connect: {
                                                id: gameId
                                            }
                                        }
                                    }
                                });

                                console.log("Player joined the CT lobby.");
                            } else {
                                console.log("Player is already in a lobby or in an unfinished CT lobby. Cannot join.");
                            }
                        } else {
                            console.log("CT Lobby is full. Cannot join.");
                        }
                    }
                }
            }
                break;
            case 't side': {
                const lobby = await prisma.lobby.findUnique({
                    where: {
                        id: gameId,
                        finished: false
                    }
                });

                if (lobby?.mode === Mode.TWO_VS_TWO) {
                    const countLobbyt = await prisma.users.count({
                        where: {
                            tLobbies: {
                                some: {
                                    id: gameId
                                }
                            }
                        }
                    });

                    console.log(`Count of T players in lobby ${gameId}: ${countLobbyt}`);

                    if (countLobbyt < 2) {
                        const isPlayerInLobby = await prisma.users.findFirst({
                            where: {
                                AND: [
                                    { id: playerId },
                                    {
                                        OR: [
                                            { tLobbies: { none: { id: gameId } } },
                                            { tLobbies: { some: { finished: true } } }
                                        ]
                                    }
                                ]
                            }
                        });

                        if (isPlayerInLobby) {
                            await prisma.users.update({
                                where: {
                                    id: playerId
                                },
                                data: {
                                    tLobbies: {
                                        connect: {
                                            id: gameId
                                        }
                                    }
                                }
                            });

                            console.log("Player joined the T lobby.");
                        } else {
                            console.log("Player is already in a lobby or in an unfinished T lobby. Cannot join.");
                        }
                    } else {
                        console.log("T Lobby is full. Cannot join.");
                    }
                } else {
                    console.log("Unsupported game mode.");
                }
            } break;
        }
    };

}