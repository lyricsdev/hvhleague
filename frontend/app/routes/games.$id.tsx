import { Spacer, Card, CardHeader, Avatar, CardBody,Image } from "@nextui-org/react"
import { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useState } from "react"
import { useAxios } from "~/api/fetcher"
import LobbyPlayer from "~/components/inLobbyPlayer"
import SkeletonLobbyPlayer from "~/components/inLobbyPlayerSkeleton"
interface Player {
    steamID: string
}
interface Data {
    id: string,
    ctPlayers: Player[],
    tPlayers: Player[]
    mode: string
    map: null
}
export const loader : LoaderFunction = async ({ request, params }) => {
    const {id} = params
    const data = await useAxios.get<Data>(`http://localhost:3001/api/games/${id}`)
    return {
        game: data
    }
}
const gameTab = () => {
    const {game} = useLoaderData<typeof loader>() as {
        game: Data
    }
    const [tplayers] = useState<Player[]>([
        ...game.tPlayers
    ])
    const [ctplayers] = useState<Player[]>([
        ...game.ctPlayers
    ])

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">

            <div className="flex hstack">
                <div>
                    <p>T side</p>

                    {
                        tplayers.map((it => {
                            return <div key={it.steamID}><LobbyPlayer steamId={it.steamID} /><Spacer y={1} /> </div>
                        }))
                    }
                    {tplayers.length < 5 &&
                        Array.from({ length: 5 - tplayers.length }).map((_, index) => (
                            <div key={index}><SkeletonLobbyPlayer /><Spacer y={1} /> </div>
                        ))
                    }
                </div>
                <div style={{
                    marginLeft: "15px",
                    marginRight: "15px"
                }}>
                    <Card className="max-w-[550px]">
                        <CardHeader className="justify-between">

                            <div className="flex gap-5">
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h5 className=" ">Location</h5>
                                </div>
                                <Avatar isBordered radius="full" size="md" src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/2560px-Flag_of_Russia.svg.png" />

                            </div>


                        </CardHeader>
                        <CardBody className="px-3 py-0">
                            <Image
                                width={"750"}
                                src='https://img.redbull.com/images/q_auto,f_auto/redbullcom/2018/06/14/ee49f42f-0a70-4811-ac42-fe8c9c7dc097/csgo-mirage-smokes'
                            />
                        </CardBody>
                    </Card>
                </div>
                <div>
                    <p>CT side</p>

                    {
                        ctplayers.map((it => {
                            return <div key={it.steamID}><LobbyPlayer steamId={it.steamID} /><Spacer y={1} /> </div>
                        }))
                    }
                    {ctplayers.length < 5 &&
                        Array.from({ length: 5 - ctplayers.length }).map((_, index) => (
                            <div key={index}><SkeletonLobbyPlayer /><Spacer y={1} /> </div>
                        ))
                    }
                </div>
            </div>

        </div>
    );
}

export default gameTab