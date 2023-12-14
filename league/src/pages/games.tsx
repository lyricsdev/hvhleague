import { useAuth } from './AuthContext';
import SocketProvider, { useSocket } from '@/components/socketProvider';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter,Divider, Link, Image, Avatar, Button } from "@nextui-org/react";
import LobbyPlayer from '@/components/inLobbyPlayer';
import { Spacer } from "@nextui-org/react";
import SkeletonLobbyPlayer from '@/components/inLobbyPlayerSkeleton';

function parseJwt(token: string) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
const SkeletonPlayer = () => {
  return (
    <div>
      <div style={{ width: '100px', height: '100px', backgroundColor: 'lightgrey' }}></div>
      <Spacer y={1} />
    </div>
  );
};
export default function Home() {
  const { token, isLoggedIn } = useAuth();
  const socket = useSocket();
  const [tplayers] = useState<{ steamid: string }[]>([

  ])
  const [ctplayers] = useState<{ steamid: string }[]>([
  
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
              return <div key={it.steamid}><LobbyPlayer steamId={it.steamid} /><Spacer y={1} /> </div>
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
              return <div key={it.steamid}><LobbyPlayer steamId={it.steamid} /><Spacer y={1} /> </div>
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
