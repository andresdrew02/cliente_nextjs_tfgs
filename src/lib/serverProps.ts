import Usuario from '@/interfaces/Usuario'
import { withSessionSsr } from './config/withSession'

type DirectionProps = {
  calle: string,
  tipo_via: string,
  numero: number,
  cp: number,
  ciudad: string,
  poblacion: string,
  pais: string,
  portal: string | null
}

export const getServerSideProps = withSessionSsr(
  async ({ req, res }: { req: any, res: any }) => {
    const user = req.session.user
    if (user === undefined || user === null || user.user_data === undefined || user.user_data === null) {
      return {
        props: {
          user: null,
          jwt: null
        }
      }
    };

    let direction: DirectionProps

    if (user.user_data.direccion !== undefined || user.user_data.direccion !== null) {
      direction = {
        calle: user.user_data.direccion?.calle,
        ciudad: user.user_data.direccion?.ciudad,
        cp: user.user_data.direccion?.cp,
        numero: user.user_data.direccion?.numero,
        pais: user.user_data.direccion?.pais,
        poblacion: user.user_data.direccion?.poblacion,
        portal: user.user_data.direccion?.portal,
        tipo_via: user.user_data.direccion?.tipo_via
      }
    }

    const usuario: Usuario = {
      data: {
        email: user.user_data.email,
        fecha_nacimiento: user.user_data.fecha_nacimiento,
        id: user.user_data.id,
        nombre_completo: user.user_data.nombre_completo,
        username: user.user_data.username,
        avatar: user.user_data.avatar === undefined || user.user_data.avatar === null ? null : user.user_data.avatar,
        recien_creada: user.user_data.recien_creada === undefined || user.user_data.recien_creada === null ? null : user.user_data.recien_creada,
        direccion: user.user_data.direccion === undefined || user.user_data.direccion === null ? null : direction
      }
    }


    return {
      props: {
        user: usuario,
        jwt: user.jwt
      }
    }
  }
)