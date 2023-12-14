import { Card, CardBody, Image, Skeleton } from "@nextui-org/react";

const SkeletonLobbyPlayer: React.FC = ({  }) => {    return (
        <Card>
            <CardBody>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton onClick={()=>{}} className="flex rounded-full w-10 h-10 pr-5"/>
                    <Skeleton className="inline h-3 w-36 rounded-lg"/>
                </div>
            </CardBody>
        </Card>
    )
}
export default SkeletonLobbyPlayer;
