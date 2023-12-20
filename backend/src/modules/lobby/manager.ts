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
    getPartyMembers = async(userId :string) => {
        const user = await prisma.users.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                partyLeader: {
                    select: {
                        members: {
                            select: {
                                id: true,
                                steamID: true
                            }
                        }
                    }
                }
            }
        })
        return await user?.partyLeader?.members
    }
    leaveFromLobby = async(playerId: string,gameId: string)=> {
        const lobby = await prisma.lobby.findFirst({
            where: {
                id: gameId
            }
        })
        if(lobby) {
            const user = await prisma.users.update({
                where: {
                    id: playerId
                },
                select: {
                    id: true,
                    partyLeader: {
                        select: {
                            members: true
                        }
                    }
                },
                data: {
                    ctLobbies: {
                        disconnect: {
                            id: gameId
                        }
                    },
                    tLobbies: {
                        disconnect: {
                            id: gameId
                        }
                    }
                }
            })
            if(user.partyLeader?.members) {
                const members = user.partyLeader.members
                for(const user of members) {
                    await prisma.users.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            ctLobbies: {
                                disconnect: {
                                    id: gameId
                                }
                            },
                            tLobbies: {
                                disconnect: {
                                    id: gameId
                                }
                            }
                        }
                    })
                }

                const countLobbyCt = await prisma.users.count({
                    where: {
                        ctLobbies: {
                            some: {
                                id: gameId
                            }
                        },
                        tLobbies: {
                            some: {
                                id: gameId
                            }
                        }
                    }
                });
                if(countLobbyCt == 0) {
                    await prisma.lobby.delete({
                        where: {
                            id: gameId
                        }
                    })
                }

            }
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
                        id: true,
                        steamID: true
                    }
                },
                tPlayers: {
                    select: {
                        id: true,

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
                                const partymemebers = await prisma.users.findFirst({
                                    where: {
                                        id: playerId
                                    },
                                    select: {
                                        id: true,
                                        partyLeader: {
                                            select: {
                                                members: true
                                            }
                                        }
                                    }
                                })
                                await prisma.users.update({
                                    where: {
                                        id: playerId
                                    },
                                    data: {
                                        ctLobbies: {
                                            connect: {
                                                id: gameId
                                            }
                                        },
                                        tLobbies: {
                                            disconnect: {
                                                id: gameId
                                            }
                                        },
                                    }
                                });
                                if(partymemebers?.partyLeader?.members) {
                                    const members = partymemebers.partyLeader.members
                                    countLobbyCt < maxPlayersPerTeam
                                    if(countLobbyCt + members.length - 1 <= maxPlayersPerTeam) {
                                        for(const user of members) {
                                            await prisma.users.update({
                                                where: {
                                                    id: user.id
                                                },
                                                data: {
                                                    ctLobbies: {
                                                        connect: {
                                                            id: gameId
                                                        }
                                                    },
                                                    tLobbies: {
                                                        disconnect: {
                                                            id: gameId
                                                        }
                                                    },
                                                }
                                            });
                                        }
                                    }
                                }
                                console.log(`Count of CT players in lobby ${gameId}: ${countLobbyCt}`);

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

                if (lobby) {
                    const maxPlayersPerTeam = lobby.mode === Mode.FIVE_VS_FIVE ? 5 : 2;
                    {
                        const countLobbyCt = await prisma.users.count({
                            where: {
                                tLobbies: {
                                    some: {
                                        id: gameId
                                    }
                                }
                            }
                        });

                        if (countLobbyCt < maxPlayersPerTeam) {
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
                                const partymemebers = await prisma.users.findFirst({
                                    where: {
                                        id: playerId
                                    },
                                    select: {
                                        id: true,
                                        partyLeader: {
                                            select: {
                                                members: true
                                            }
                                        }
                                    }
                                })
                                await prisma.users.update({
                                    where: {
                                        id: playerId
                                    },
                                    data: {
                                        tLobbies: {
                                            connect: {
                                                id: gameId
                                            }
                                        },
                                        ctLobbies: {
                                            disconnect: {
                                                id: gameId
                                            }
                                        }
                                    }
                                });
                                if(partymemebers?.partyLeader?.members) {
                                    const members = partymemebers.partyLeader.members
                                    countLobbyCt < maxPlayersPerTeam
                                    if(countLobbyCt + members.length - 1 <= maxPlayersPerTeam) {
                                        for(const user of members) {
                                            await prisma.users.update({
                                                where: {
                                                    id: user.id
                                                },
                                                data: {
                                                    ctLobbies: {
                                                        connect: {
                                                            id: gameId
                                                        }
                                                    },
                                                    tLobbies: {
                                                        disconnect: {
                                                            id: gameId
                                                        }
                                                    },
                                                }
                                            });
                                        }
                                    }
                                }
                                console.log("Player joined the CT lobby.");
                                console.log(`Count of CT players in lobby ${gameId}: ${countLobbyCt}`);

                            } else {
                                console.log("Player is already in a lobby or in an unfinished CT lobby. Cannot join.");
                            }
                        } else {
                            console.log("CT Lobby is full. Cannot join.");
                        }
                    }
                }
            } break;
        }
    };
    

}