import { Avatar, Button, Image } from "@nextui-org/react";
import { redirect, type ActionFunction, type MetaFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useAxios } from "~/api/fetcher";
import { userContext } from "~/root";
import { useContext } from "react";
import { authenticator } from "~/api/auth";
import { getUserSession } from "~/api/user";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
import { Player } from "~/api/interfaces";
import { getColorStatus } from "~/api/utils";
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
 
  return (
    <div className="flex gap-4 items-center">
     
    </div>
  );
}
