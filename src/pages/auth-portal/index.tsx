import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import logo from "../../img/logo.png";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { useRouter } from "next/router";
import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import RegisterForm from '@/components/RegisterForm'
export default function AuthPortal() {
  const router = useRouter();
  const [form, setForm] = useState<number>(0)

  return (
    <>
    <div>
      <div className="flex flex-col px-4 py-16">
        <p className="text-3xl font-bold text-center z-50">{form === 0 ? 'Iniciar sesión' : 'Registrarse'}</p>
        <div className="flex justify-evenly h-96 mt-4">
          <div className="w-1/3">
            <div className="text-base z-50">
              <div
                className="text-lg flex items-center gap-2 rounded-md w-44 font-bold p-2 hover:cursor-pointer active:scale-95 transition-all"
                onClick={() => router.push("/market")}
              >
                <HiArrowUturnLeft className="z-50 text-2xl" />
                <p className="z-50">Ir al mercado</p>
              </div>
            </div>
          </div>
          <div className="w-1/3 z-50 flex flex-col gap-4">
            {form === 0 ? <LoginForm /> : <RegisterForm/>}
            <div className="ml-[-2rem] w-full flex justify-center">
            <Tabs variant="soft-rounded" colorScheme="cyan" onChange={e => setForm(e)}>
              <TabList>
                <Tab>Iniciar sesión</Tab>
                <Tab>Registrarse</Tab>
              </TabList>
            </Tabs>
            </div>
          </div>
          <div className="w-1/3 bg-base-200 h-full p-10 max-w-md rounded-lg flex flex-col gap-4 z-50">
            <Image alt="logo de la empresa" src={logo} />
            <p className="text-2xl font-bold">
              "Cada pieza cuenta su propia historia, descubre cuál es la tuya
              con Crearte"
            </p>
          </div>
        </div>
      </div>
    </div>
    </>  
  );
}
