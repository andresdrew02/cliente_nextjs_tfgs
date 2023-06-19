import { Button, Center } from "@chakra-ui/react";
import logo from "../img/light_logo.png";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { postResetPassword, resetUserPassword } from "@/lib/api";
import Success from "@/components/Success";
import Error from '@/components/Error'
import { useRouter } from "next/router";
import { setLocalCookie } from "@/utils/cookies";

export default function SetPasswordResetForm({code}:{code: string | string[] | undefined}) {
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const router = useRouter()

    const handleReset = async (event: FormEvent<HTMLFormElement>) => {
        setLoading(true)
        setError(false)
        setSuccess(false)
        event.preventDefault()
        if (code === undefined || Array.isArray(code)){
          setLoading(false)
          return
        }
        const res = await postResetPassword(new FormData(event.currentTarget), code)
        if (res.error !== undefined && res.error.message !== null){
          setError(true)
          setErrorMsg(`${res.error.name}: ${res.error.message}`)
        }else{
          setSuccess(true)
          setTimeout(() => {
            router.push('/auth-portal')
          },1500)
        }
        setLoading(false)
    }
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen w-full lg:py-0 bg-slate-800">
       <div className="max-w-lg mb-4 mt-4">
        {success && <Success msg="Contraseña reestablecida, redireccionando al mercado..."/>}
        {error && <Error msg={errorMsg}/>}
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
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirma su contraseña
              </label>
              <input
                type="password"
                name="passwordConfirmation"
                id="passwordConfirmation"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <Button isLoading={loading} type="submit" colorScheme='facebook' className="w-full">Cambiar contraseña</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
