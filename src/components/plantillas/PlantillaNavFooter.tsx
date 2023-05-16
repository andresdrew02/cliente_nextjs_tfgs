import Footer from "../Footer";
import Navbar from "../Navbar";
import { ReactNode } from "react";
import Usuario from "@/interfaces/Usuario";

export default function PlantillaNavFooter({children, user}: {children: ReactNode, user: Usuario | null}){
    return(
        <>
            <Navbar usuario={user === null ? {data: null} : user}/>
                {children}
            <Footer/> 
        </>
    )
}