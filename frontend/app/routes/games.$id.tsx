import { Spacer, Card, CardHeader, Avatar, CardBody, Image, Button } from "@nextui-org/react"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { authenticator } from "~/api/auth"
import { useAxios } from "~/api/fetcher"
import { getUserSession } from "~/api/user"
import ChatBox from "~/components/chatBox"
import MapsList, { MapVotes } from "~/components/mapsList"
import { useSocket } from "~/components/socket"
import TeamLobby, { Data, Player, map } from "~/components/teamcustom"

export const loader: LoaderFunction = async ({ request, params }) => {
    let user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    if (user) {
        let user = await getUserSession(request)
        console.log(user)
        const { id } = params
        const data = await useAxios.get<Data>(`/games/${id}`)
        console.log(data)
        if(data)
        return {
            game: data,
            gameId: id,
            playerId: user?.user.id,

        }
        return redirect("/")
    }
}
export const action: ActionFunction = async ({ request, context }) => {
    const formData = await request.formData();
    const joinGame = await formData.get("action")
    const joinLobby = await formData.get("joinLobby")
    if (joinLobby) {
        const data = JSON.parse(joinLobby as string) as {
            side: string,
            gameId: string
        }
        const JoinTeam = await useAxios.post(`/games/joingame/${data.gameId}`, data)
    }
    switch(joinGame) {
        case "leaveLobby": {
            const gameId = await formData.get("gameId")
            const leave = await useAxios.post(`/games/leaveLobby`, {gameId})
            return await redirect("/game")
        }break;
       
    }
    return {
        dada: "dada"
    }
}

const gameTab = () => {
    const socket = useSocket()
    const { game, gameId, playerId } = useLoaderData<typeof loader>() as {
        game: Data,
        gameId: string,
        playerId: string,
    }
    const [maps, setmaps] = useState<map[]>([])
    const [votes, setVotes] = useState<MapVotes>({})

    const [selectedMap, setselectedMap] = useState<map>(game.map)
    useEffect(() => {
        if (!socket) return;
        socket.emit("checkRoom", {
            roomId: gameId,
            playerId: playerId
        })

        socket.on("maps", (map: map[]) => {
            setmaps(map)
        })
        socket.on("updateMapVotes", (maps: MapVotes) => {
            setVotes(maps)
        })
        socket.on("mapSelected", (maps: map) => {
            setselectedMap(maps)
        })
        return () => {
            socket.off('checkRoom');
            socket.off('mapSelected');
            socket.off('updateMapVotes');

        };
    }, [socket]);
    const [tplayers] = useState<Player[]>([
        ...game.tPlayers
    ])
    const [ctplayers] = useState<Player[]>([
        ...game.ctPlayers
    ])
    const isPlayerInLobby = () => {
        const check = [...ctplayers, ...tplayers].some((it) => {
            return it.id === playerId
        });
        return check;
      };
    const getMode = () => {
        switch (game.mode) {
            case "TWO_VS_TWO": {
                return "2 ПРОТИВ 2"
            }
            case "FIVE_VS_FIVE": {
                return "5 ПРОТИВ 5"
            }
        }
    }
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="flex hstack">
                <TeamLobby gameId={gameId} side={'t side'} mode={game.mode} players={tplayers} />
                {
                    isPlayerInLobby() && <Form method="post">
                              <input style={{
                                display: "none"
                              }} name="gameId" defaultValue={gameId} type="text" />

                        <Button type="submit" value="leaveLobby" name="action">Ливаем емае</Button>
                    </Form>
                }
                <div style={{ marginLeft: '15px', marginRight: '15px' }}>
                    {selectedMap && <Card className="max-w-[550px]">
                        <CardHeader className="justify-between">
                            <div className="flex gap-5">
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h5 className=" ">Location</h5>
                                </div>
                                <Avatar
                                    isBordered
                                    radius="full"
                                    size="md"
                                    src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/2560px-Flag_of_Russia.svg.png"
                                />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h5 className=" ">Режим :{getMode()}</h5>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="">
                            <Image
                                width={'750'}
                                src={selectedMap.imageUrl}
                            />
                        </CardBody>
                    </Card>}
                    {
                        !selectedMap && <MapsList maps={maps} roomId={gameId} mapVotes={votes} />
                    }
                </div>
                <TeamLobby gameId={gameId} side={'ct side'} mode={game.mode} players={ctplayers} />
            </div>
        </div>
    );
};


export default gameTab