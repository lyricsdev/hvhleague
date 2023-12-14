import { Server, Socket } from 'socket.io';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import lobbyManager from './../modules/lobby/manager';
import { getConfig } from '../config/config';

interface RankQueueItem {
    socket: Socket;
    rank: number;
    steamid: string;
}




class SocketServer {
    private io: Server;
    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000", // Replace with your Next.js app URL
                methods: ["GET", "POST"],
            },
        });
        this.configure();
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
            });
        });
    }
}

export default SocketServer;
