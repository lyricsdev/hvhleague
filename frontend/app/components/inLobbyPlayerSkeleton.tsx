import { Button, Card, CardBody, Image, Skeleton } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
interface props {
    side: string
    gameId: string
}
const SkeletonLobbyPlayer: React.FC<props> = ({side,gameId}) => {
    return (
        <Card>
            <CardBody>
                <Form method="POST" reloadDocument>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button type="submit" name="joinLobby" value={JSON.stringify({
                            gameId: gameId,
                            side: side
                        })} className="flex rounded-full w-5 h-10 pr-5">

                        </button>
                        <Skeleton className="inline h-3 w-36 rounded-lg" />
                    </div>
                </Form>
            </CardBody>
        </Card>
    )
}
export default SkeletonLobbyPlayer;
