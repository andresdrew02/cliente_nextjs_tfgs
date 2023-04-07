import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react'
import Usuario from '../interfaces/Usuario'

export interface UserContextInterface {
    usuario: Usuario,
    setUsuario: Dispatch<SetStateAction<Usuario>>
}

const defaultState = {
    usuario: {
        data: null
    },
    setUsuario: (usuario:Usuario) => {}
} as UserContextInterface

export const UserContext = createContext(defaultState)

type UserProvideProps = {
    children: ReactNode
}

export default function UserProvider({children}: UserProvideProps){
    const [usuario, setUsuario] = useState<Usuario>({
        data: null
    })
    return(
        <UserContext.Provider value={{usuario, setUsuario}}>
            { children }
        </UserContext.Provider>
    )
}