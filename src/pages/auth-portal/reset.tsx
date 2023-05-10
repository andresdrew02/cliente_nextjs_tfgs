import ErrorPage from "@/components/ErrorPage"
import SetPasswordResetForm from "@/components/SetPasswordResetForm"
import { useRouter } from "next/router"
import { API_URL } from "@/lib/api"
import { useEffect } from "react"

export default function reset() {
    const router = useRouter()
    const { code } = router.query

    if (code === undefined || code === null){
      return(
        <ErrorPage errorCode={null} errorMsg="Código no encontrado...🥺"/>
      )
    }

    const checkToken = async () => {
      if (!code){
        return router.push('/error/errorPage?code=400&msg"El token para reestablecer la contraseña no es válido o a expirado"')
      }

      const res = await fetch(`${API_URL}/user/checkResetToken`,{
        method: 'POST',
        body: JSON.stringify({
          token: code
        })
      })

      if (!res.ok){
        return router.push('/error/errorPage?code=400&msg=El%20token%20para%20reestablecer%20la%20contraseña%20no%20es%20válido%20o%20a%20expirado')
      }
    }

    useEffect( () => {
      checkToken()
    },[])

  return (
    <SetPasswordResetForm code={code}/>
  )
}
