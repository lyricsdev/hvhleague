import { Button, Card, CardBody, Image, Skeleton } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
export const  action : ActionFunction = async({ request, context }) => {
    const formData = await request.formData();
    console.log(formData)
    return {
        dada: "dada"
    }
}
const SkeletonLobbyPlayer: React.FC = ({ }) => {
    return (
        <Card>
            <CardBody>
                <Form method="POST">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button type="submit" name="action" value="login" className="flex rounded-full w-5 h-10 pr-5">

                        </button>
                        <Skeleton className="inline h-3 w-36 rounded-lg" />
                    </div>
                </Form>
            </CardBody>
        </Card>
    )
}
export default SkeletonLobbyPlayer;
