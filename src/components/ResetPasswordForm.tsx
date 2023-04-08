import { Button, Center } from "@chakra-ui/react";
import logo from "../img/light_logo.png";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { resetUserPassword } from "@/lib/api";
import Success from "@/components/Success";
import Error from '@/components/Error'

export default function ResetPasswordForm() {
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const handleReset = async (event: FormEvent<HTMLFormElement>) => {
        setLoading(true)
        setError(false)
        setSuccess(false)
        event.preventDefault()
        const res = await resetUserPassword(new FormData(event.currentTarget))
        if (!res){
            setError(true)
        }else{
            setSuccess(true)
        }
        setLoading(false)
    }
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen w-full lg:py-0 bg-slate-800">
       <div className="max-w-lg mb-4 mt-4">
        {success && <Success msg="Si existe un usuario o un correo electrónico asociado, debería de recibir un correo electrónico con un link para reestablecer su contraseña, este email podría tardar en llegar entre 5-10 minutos"/>}
        {error && <Error msg="Ha ocurrido un error al intentar mandar un correo de reestablecimiento de contraseña, inténtelo de nuevo mas tarde"/>}
       </div>
        <div className="lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:border-gray-700 sm:p-8 glass-card">
          <Center mb={4} mt={4}>
            <Image
              src={logo}
              alt="Nombre de la empresa"
              className="w-20 h-8 mr-2 object-cover"
            />
          </Center>
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Cambio de contraseña
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleReset}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Correo electrónico
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <Button isLoading={loading} type="submit" colorScheme='facebook' className="w-full">Solicitar cambio de contraseña</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
