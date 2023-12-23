export type status =   "ONLINE" | "OFFLINE" | "INGAME"
export interface Player {
    id: string
    steamID: string
    avatar: string | null
    status : status
}
export interface map {
    id: string,
    name: string,
    imageUrl:string
}
export interface GameData {
    id: string,
    ctPlayers: Player[],
    tPlayers: Player[]
    mode: string
    map: map
}
export interface propTeam  {
    players : Player[],
    side: string,
    gameId: string,
    mode: string
}