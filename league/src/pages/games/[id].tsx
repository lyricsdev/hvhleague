import LobbyPlayer from '@/components/inLobbyPlayer';
import SkeletonLobbyPlayer from '@/components/inLobbyPlayerSkeleton';
import { useSocket } from '@/components/socketProvider';
import { Spacer, Card, Image, CardHeader, Avatar, CardBody } from '@nextui-org/react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
function serialize(obj: any) {
    const str = JSON.stringify(obj, (_, value) =>
        value instanceof Headers ? serializeHeaders(value) : value
    );
    return JSON.parse(str);
}

function serializeHeaders(headers: Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
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
export const getServerSideProps = (async (context) => {
    const slug = context.query.id;
    const res = await axios.get(`http://localhost:3001/api/games/${slug}`)
    const result : Data = res.data
    return {
    props: {
        result
    }
   }
}) satisfies GetServerSideProps<{result :Data}>

export default function Home({
    result,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if(!result) {
        return <></>
    }
    const { token, isLoggedIn } = useAuth();
    const socket = useSocket();
    const [tplayers] = useState<Player[]>([
        ...result.tPlayers
    ])
    const [ctplayers] = useState<Player[]>([
        ...result.ctPlayers
    ])

    useEffect(() => {
        if (socket) {

            return () => {

            };
        }
    }, [socket]);

    if (!token) return <></>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

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
                                height={"10"}
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
