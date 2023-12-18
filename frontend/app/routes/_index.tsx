import { Button, Image } from "@nextui-org/react";
import { redirect, type ActionFunction, type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { SteamIcon } from "~/components/steamicon";
import svg from './../assets/steam.svg'
import { useAxios } from "~/api/fetcher";
import { userContext } from "~/root";
import { useContext } from "react";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const  action : ActionFunction = async({ request, context }) => {
  const form = await request.formData()
  const action = await form.get("action")
  console.log(action)
  switch (action) {
    case "steamauth": {
      const getauth = await useAxios.get<any>("/auth/steam")

      return await redirect(getauth.url)
    }
  }
  return {

  }
}
export default function Index() {
  const user = useContext(userContext)
  return (
    <div className="flex gap-4 items-center">
      <Form method="post">
      <Button isIconOnly color="warning" variant="faded" aria-label="Take a photo"
      type="submit" name="action" value={"steamauth"}
      > <Image
        alt="nextui logo"
        height={40}
        radius="sm"
        src={svg}
        width={40}
        style={{ paddingRight: '5px' }}

      /></Button>
      </Form>
      {user?.steamid}
    </div>
  );
}
