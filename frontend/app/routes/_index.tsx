import { Avatar, Button, Image } from "@nextui-org/react";
import { redirect, type ActionFunction, type MetaFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { SteamIcon } from "~/components/steamicon";
import svg from './../assets/steam.svg'
import { useAxios } from "~/api/fetcher";
import { userContext } from "~/root";
import { useContext } from "react";
import { authenticator } from "~/api/auth";
import { getUserSession } from "~/api/user";
import { Player } from "~/components/teamcustom";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (user) {
    let decoded = await getUserSession(request)
    if (decoded) {
      const members = await useAxios.post<Player[] | null>("/games/partymembers", {})
      return {
        members
      }
    }

  }
}
export const action: ActionFunction = async ({ request, context }) => {
  const form = await request.formData()
  const action = await form.get("action")
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
  const { members } = useLoaderData<typeof loader>() as {
    members: Player[] | null
  }
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
      <p>party members</p>
      {
        members && members.map((it) => {
          return <Avatar isBordered radius="none" src={it.avatar ? it.avatar : "" } />
        })
      }
    </div>
  );
}
