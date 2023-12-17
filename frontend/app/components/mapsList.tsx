import React from 'react';
import { Card, Avatar, CardHeader, CardBody } from '@nextui-org/react';
import { useSocket } from './socket';

interface Map {
    id: string;
    name: string;
    imageUrl: string;
}

export interface MapVotes {
    [mapId: string]: {
        votes: number;
        voters: string[];
    };
}

interface MapsListProps {
    maps: Map[];
    mapVotes?: MapVotes;
    roomId:string
}

const MapsList: React.FC<MapsListProps> = ({ maps, mapVotes = {},roomId }) => {
    const socket = useSocket()
    const handleClick =(roomId : string,mapId : string)=> {
        if(!socket) return
        socket.emit("voteMap",{
            roomId,
            mapId
        })
    }
    return (
        <Card>
            <CardHeader>
                <h2>Available Maps</h2>
            </CardHeader>
            <CardBody>
                <div className="flex justify-center items-center">
                    {maps.map((map) => (
                        <Card
                            key={map.id}
                            style={{  width: '150px', height: '250px' }}
                        >
                            <CardHeader>
                                <Avatar isBordered radius="full" size="md" src={map.imageUrl} onClick={() => handleClick(roomId,map.id)} />
                            </CardHeader>
                            <CardBody>
                                <h5>{map.name}</h5>
                                { 
                                 mapVotes!! &&  <p>Votes: {mapVotes[map.id]?.votes || 0}</p>
                                }
                                {
                                    mapVotes === null && <p>Votes: {0}</p> 
                                }
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default MapsList;
