import "reflect-metadata";
import express, { Express } from "express";
import {
    Action,
    UnauthorizedError,
    useExpressServer,
} from "routing-controllers";
import jwt from "jsonwebtoken";

import { getConfig } from './config/config'
import { ErrorHandler } from "./middleware/errorHandler";
import { authController } from "./modules/auth/auth.controller";
import { Server } from 'socket.io';
import http from 'http';

import SocketServer from './sockets/sockets'
import { LobbyController } from "./modules/lobby/lobby.controller";
import prisma from "./modules/prisma/prisma.client";
const app: Express = express();
const server = http.createServer(app);

app.listen(getConfig().PORT, async () => {
    console.log("core succesfully start at", getConfig().PORT);
    const usr = await prisma.users.findFirst({
        where: {
            id: "5b4f288e-629a-4638-8442-0614f88b08b9"
        },
        select: {
            id: true,
            partyLeader: {
                select: {
                    id: true,
                    members: true
                }
            }
        }
    })
    const test = false
    if(test) {
        await prisma.users.update({
            where: {
                id: "5b4f288e-629a"
            },
            data: {
                partyMember: {
                    connect: {
                        id: usr?.partyLeader?.id
                    }
                }
            }
        })
    }
});
const socketServer = new SocketServer(server);
server.listen(getConfig().WEBSOCKETSPORT, () => {
    console.log(`websockets is running on port ${getConfig().WEBSOCKETSPORT}`);
});
useExpressServer(app, {
    development: false,
    defaultErrorHandler: false,
    cors: {
        origin: [
            "http://localhost:3000",
        ],
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        headers: ["*"],
        credentials: true,
    },
    middlewares: [ErrorHandler],
    authorizationChecker: async (action: Action, roles: number[]) => {
        return true;
    },
    routePrefix: "/api",
    controllers: [authController, LobbyController],
});