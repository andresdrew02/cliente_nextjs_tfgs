import ErrorPage from "@/components/ErrorPage"
import SetPasswordResetForm from "@/components/SetPasswordResetForm"
import { useRouter } from "next/router"

export default function reset() {
    const router = useRouter()
    const { code } = router.query
    if (code === undefined || code === null){
      return(
        <ErrorPage errorCode={null} errorMsg="Código no encontrado...🥺"/>
      )
    }
  return (
    <SetPasswordResetForm code={code}/>
  )
}
