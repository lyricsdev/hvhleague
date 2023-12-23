import { Avatar } from "@nextui-org/react";
import { FC } from "react";
import { Player } from "~/api/interfaces";
import { getColorStatus } from "~/api/utils";
import test from './../assets/test.svg'
interface props {
    members: Player[] | null
}
const UserParty: FC<props> = ({ members}) => {
    return (<div className="flex flex-wrap gap-4">
        <p>party members</p>
        {
            members && members.map((it) => {
                return <Avatar key={it.id} isBordered radius="none" color={getColorStatus(it.status)} src={it.avatar ? it.avatar : ""}></Avatar>
            })
        }
        {members && members.length < 5 &&
            Array.from({ length: 5 - members.length }).map((_, index) => (
                <div key={index}><Avatar onClick={() => { console.log("bruh") }} radius="none" src={test} /> </div>
            ))
        }
    </div>)
}
export default UserParty