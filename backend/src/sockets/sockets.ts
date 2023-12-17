import { Server, Socket } from 'socket.io';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import lobbyManager from './../modules/lobby/manager';
import { getConfig } from '../config/config';
import prisma from "./../modules/prisma/prisma.client"
import { Map } from '@prisma/client';

interface RankQueueItem {
    socket: Socket;
    rank: number;
    steamid: string;
}

interface checkRoomI {
    playerId: string
    roomId: string
}
interface MapVotes {
    [roomId: string]: {
        [mapId: string]: {
            votes: number;
            voters: string[];
        };
    };
}

interface voteMap {
    roomId: string
    mapId: string
}
class SocketServer {
    private io: Server;
    private lobbyManager: lobbyManager
    private mapVotes: MapVotes = {};
    constructor(server: http.Server) {
        this.lobbyManager = new lobbyManager()
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });
        this.configure();
    }
    private async handleCheckRoom(object: checkRoomI, socket: Socket) {
        const { playerId, roomId } = object;
        const lobby = await prisma.lobby.findUnique({
            where: {
                id: roomId,
            },

            select: {
                mode: true,
                map: true,
                ctPlayers: true,
                tPlayers: true
            }
        });
        if (lobby) {
            const { mode, ctPlayers, tPlayers } = lobby;
            const totalPlayers = ctPlayers.length + tPlayers.length;
            const isInLobby = await prisma.users.findFirst({
                where: {
                    id: playerId,
                    OR: [
                        { ctLobbies: { some: { id: roomId } } },
                        { tLobbies: { some: { id: roomId } } },
                    ],
                },
            });
            if (isInLobby) {
                socket.join(roomId)
                console.log(`Player ${playerId} joined lobby ${roomId}.`);
                this.io.to(roomId).emit("debil", "debil")
                this.io.to(roomId).emit("updateMapVotes", this.mapVotes[roomId]);
                const data = await prisma.map.findMany()
                switch (mode) {
                    case 'TWO_VS_TWO': {
                        if (totalPlayers == 4) {
                            this.io.to(roomId).emit("maps", data)
                        }
                    } break;
                    case 'FIVE_VS_FIVE': {
                        if (totalPlayers == 10) {
                            this.io.to(roomId).emit("maps", data)
                        }
                    } break;
                }
            }

        }
    }
    private async calculateAndSelectMap(roomId: string): Promise<Map | null> {
        const lobby = await prisma.lobby.findUnique({
            where: {
                id: roomId,
            },

            select: {
                mode: true,
                map: true,
                ctPlayers: true,
                tPlayers: true
            }
        });
        if (lobby) {
            const totalVotes = Object.values(this.mapVotes[roomId]).reduce((sum, map) => sum + map.votes, 0);

            const threshold = lobby.mode === "TWO_VS_TWO"  ? 4 : 10;
            if (totalVotes >= 1) {
                const mapVotesArray = Object.entries(this.mapVotes[roomId]);
        
                mapVotesArray.sort(([, map1], [, map2]) => map2.votes - map1.votes);
        
                const highestVotes = mapVotesArray[0][1].votes;
        
                const highestVotedMaps = mapVotesArray.filter(([, map]) => map.votes === highestVotes);
                console.log(highestVotes)
                if (highestVotedMaps.length === 1) {
                    const selectedMapId = highestVotedMaps[0][0];
                    console.log(`Selected mapId: ${selectedMapId} in roomId: ${roomId} based on votes.`);
                    const map = await prisma.map.findFirst({
                        where: {
                            id: selectedMapId
                        }
                    })
                    return map;
                }
        
                const randomMapIndex = Math.floor(Math.random() * highestVotedMaps.length);
                const randomMapId = highestVotedMaps[randomMapIndex][0];
                console.log(`Selected mapId: ${randomMapId} in roomId: ${roomId} randomly from highest voted maps.`);
                const map = await prisma.map.findFirst({
                    where: {
                        id: randomMapId
                    }
                })
                return map;
            }
            
        }
        return null
    }
    private async updateMapVotes(roomId: string, mapId: string, userId: string): Promise<void> {
        if (!this.mapVotes[roomId]) {
            this.mapVotes[roomId] = {};
            console.log(`Created mapVotes entry for roomId: ${roomId}`);
        }

        const hasVotedForAnyMap = Object.values(this.mapVotes[roomId]).some(map => map.voters.includes(userId));
        if (hasVotedForAnyMap) {
            console.log(`User ${userId} has already voted in roomId: ${roomId}`);
            return;
        }

        if (!this.mapVotes[roomId][mapId]) {
            this.mapVotes[roomId][mapId] = {
                votes: 1,
                voters: [userId],
            };
            console.log(`Initialized votes for mapId: ${mapId} in roomId: ${roomId}`);
        } else {
            if (this.mapVotes[roomId][mapId].voters.includes(userId)) {
                console.log(`User ${userId} has already voted for mapId: ${mapId} in roomId: ${roomId}`);
                return;
            }

            this.mapVotes[roomId][mapId].votes += 1;
            this.mapVotes[roomId][mapId].voters.push(userId);
            console.log(`Updated votes for mapId: ${mapId} in roomId: ${roomId}`);
        }

        this.io.to(roomId).emit("updateMapVotes", this.mapVotes[roomId]);
        const selectedMapId = await this.calculateAndSelectMap(roomId);

        if (selectedMapId) {
            console.log(`Selected mapId: ${selectedMapId} in roomId: ${roomId} based on votes.`);
            this.io.to(roomId).emit("mapSelected", selectedMapId);
            await prisma.lobby.update({
                where: {
                    id: roomId
                },
                data: {
                    map: {
                        connect: {
                            id: selectedMapId.id
                        }
                    }
                }
            })
        }
    }


    private configure(): void {
        this.io.on('connection', (socket: Socket) => {
            const token = socket.handshake.auth;
            console.log(token)
            if (!token['token']) {
                console.log('Unauthorized access. No JWT token provided.');
                socket.disconnect(true);
                return;
            }

            jwt.verify(token['token'], getConfig().JWTTOKEN, (err: any, decoded: any) => {
                if (err) {
                    console.log('Invalid JWT token.');
                    socket.disconnect(true);
                    return;
                }

                console.log('User authenticated:', decoded.steamid);
                socket.on("checkRoom", async (data: checkRoomI) => {
                    this.handleCheckRoom(data, socket)
                    
                })
                socket.on("voteMap", async (data: voteMap) => {
                   await this.updateMapVotes(data.roomId, data.mapId, decoded.steamid);
                });
            });

        });
    }
}

export default SocketServer;
