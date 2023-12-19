import { io, Socket } from "socket.io-client";
import jwt from 'jsonwebtoken';
type Location = "eu" | "ru" | "us"
type ServerStatus = "offline" | "online" | "inGame" | "waitingForPlayers"
interface clientInfo {
    servername: string
    location: Location
    ip: string
    port: string
    status: ServerStatus
}
let newInformation : clientInfo = {
    servername: "test1",
    location: "eu",
    ip: "127.0.0.1",
    port: "27015",
    status: "online"
}
const generateAuthToken = (generate: boolean = false)=> {
    if(generate) {
     return jwt.sign(newInformation,  "YOURSECRETKEY", { expiresIn: '24h' })
    }
}
const serverToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2ZXJuYW1lIjoidGVzdDEiLCJsb2NhdGlvbiI6ImV1IiwiaXAiOiIxMjcuMC4wLjEiLCJwb3J0IjoiMjcwMTUiLCJzdGF0dXMiOiJvbmxpbmUiLCJpYXQiOjE3MDMwMDg3NjQsImV4cCI6MTcwMzA5NTE2NH0.BGS97e90XKqzJadayW89Zg1p60NGNG3r4unn38u7PRg"
const socket: Socket = io("http://localhost:3002",{
    auth: {
        "serverAuth": serverToken
    }
});
socket.on('connect', ()=>{
    console.log('bruh')
});
socket.on("disconnect", ()=>{
    console.log("client disconnected from server");
});
socket.on("serverStatus",()=> {
    console.log(`status now ${newInformation.status}`)
    switch(newInformation.status) {
        case "online": {
            newInformation.status = "waitingForPlayers"
            socket.emit("changeStatus",newInformation)
        }break;
        case "waitingForPlayers" :{
            newInformation.status = "inGame"
            socket.emit("changeStatus",newInformation)
        } break;
        default: {
            socket.emit("changeStatus",newInformation)
        }
    }
})