import { FC } from "react";

interface MainProp {
    children: React.ReactNode;
  };

const Main : FC<MainProp> = ({children})=> {
    return (<main className="container mx-auto">
            {children}
    </main>)
}
export default Main