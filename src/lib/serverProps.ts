import Usuario from "@/interfaces/Usuario";
import { API_URL, getUserInfo } from "./api";
import nookies from "nookies";

export default async function getServerSideProps(ctx: any) {
  const cookies = nookies.get(ctx);
  if (cookies.jwt === undefined || cookies.jwt === null){
    return{
        props:{
            user: null
        }
    }
  }
  try{
    const user_data = await getUserInfo(cookies.jwt)
    const user: Usuario = {
    data: {
        email: user_data.email,
        fecha_nacimiento: user_data.fecha_nacimiento,
        id: user_data.id,
        nombre_completo: user_data.nombre_completo,
        username: user_data.username,
        avatar:user_data.avatar === undefined || user_data.avatar === null ? null : user_data.avatar.url,
        recien_creada: user_data.recien_creada === undefined || user_data.recien_creada === null ? null : user_data.recien_creada
    }
  }
  return {
    props: {
      user: user,
    },
  };
  }
  catch(err){
    return{
        props:{
            user: null
        }
    }
  }
}
