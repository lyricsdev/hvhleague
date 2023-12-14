
import { Card, CardBody, Image } from "@nextui-org/react";
interface PlayerProps {
    steamId: string
}
import image from './../assets/SeasonalRankTop0.png'
const LobbyPlayer: React.FC<PlayerProps> = ({ steamId }) => {

    return (
        <Card>
            <CardBody>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src={image}
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
