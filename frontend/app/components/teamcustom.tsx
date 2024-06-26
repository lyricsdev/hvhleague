import { Spacer } from "@nextui-org/react"
import LobbyPlayer from "./inLobbyPlayer"
import SkeletonLobbyPlayer from "./inLobbyPlayerSkeleton"
import { propTeam } from "~/api/interfaces"

const TeamLobby: React.FC<propTeam> = ({players,side,gameId,mode }) => {
    const moding = ()=> {
        switch(mode) {
            case "FIVE_VS_FIVE": {
                    return (<>
                     {players.length < 5 &&
                Array.from({ length: 5 - players.length }).map((_, index) => (
                    <div key={index}><SkeletonLobbyPlayer gameId={gameId} side={side} /><Spacer y={1} /> </div>
                ))
            }
                    </>)
            }break;
            case "TWO_VS_TWO": {
                return (
                    <>
                    {players.length < 2 &&
                        Array.from({ length: 2 - players.length }).map((_, index) => (
                            <div key={index}><SkeletonLobbyPlayer gameId={gameId} side={side} /><Spacer y={1} /> </div>
                        ))
                    }
                    </>
                )
            }break;
        }
    }
    return (
        <div>
            <p style={{
                color: "black"
            }}>{side} {mode}</p>
            {
                players.map((it => {
                    return <div key={it.steamID}><LobbyPlayer avatar={it.avatar} steamId={it.steamID} /><Spacer y={1} /> </div>
                }))
            }
            {
                moding()
            }
    </div>
    )
}
export default TeamLobby;
