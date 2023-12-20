import { Spacer, Card, CardHeader, Avatar, CardBody, Image, Button } from "@nextui-org/react"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/api/auth"
import { useAxios } from "~/api/fetcher"
import { getUserSession } from "~/api/user"

import { Select, SelectItem } from "@nextui-org/react";
export const loader: LoaderFunction = async ({ request, params }) => {
    return {}
}
export const action: ActionFunction = async ({ request, context }) => {
    const formData = await request.formData();
    const action = await formData.get("action")
    console.log(action)

    switch (action) {
        case "createLobby":
            const mode = await formData.get("mode")
            const data = await useAxios.post<any>("/games/createLobby",{mode})
            console.log(data)
            if(data.lobbyId) {
                return await redirect(`/games/${data.lobbyId}`)
            }
            break;

        default:
            break;
    }

    return {
        dada: "dada"
    }
}

const gameTab = () => {

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="flex hstack">
                <Form method="post">
                    <select
                        name="mode"
                        defaultValue={"TWO_VS_TWO"}
                        onChange={()=>{}}
                        className="p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="TWO_VS_TWO">2 VS 2</option>
                        <option value="FIVE_VS_FIVE">5 VS 5</option>
                    </select>
                    <Button type="submit" name="action" value={"createLobby"}>Создать лобби</Button>
                </Form>
            </div>
        </div>
    );
};


export default gameTab