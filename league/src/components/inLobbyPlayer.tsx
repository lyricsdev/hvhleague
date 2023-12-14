
import { Card, CardBody, Image } from "@nextui-org/react";
interface PlayerProps {
    steamId: string
}
const LobbyPlayer: React.FC<PlayerProps> = ({ steamId }) => {

    return (
        <Card>
            <CardBody>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src={"http://localhost:3000/SeasonalRankTop0.png"}
                        width={40}
                        style={{ paddingRight: '5px'}}
                    />
                    <p style={{ display: 'inline' }}>{steamId}</p>
                </div>
            </CardBody>
        </Card>
    )
}
export default LobbyPlayer;
