import { withSessionSsr } from './config/withSession'
import { API_URL } from './api'

export const getServerSideProps = withSessionSsr(
  async ({req,res}:{req:any,res:any}) => {
    const user = req.session.user
    if (user === undefined || user === null || user.user_data === undefined || user.user_data === null){
      return{
        props:{
          user:null,
          jwt:null
        }
      }
      };

    return{
      props:{
        user: {
          data: {
            email: user.user_data.email,
            fecha_nacimiento: user.user_data.fecha_nacimiento,
            id: user.user_data.id,
            nombre_completo: user.user_data.nombre_completo,
            username: user.user_data.username,
            avatar:user.user_data.avatar === undefined || user.user_data.avatar === null ? null : user.user_data.avatar,
            recien_creada: user.user_data.recien_creada === undefined || user.user_data.recien_creada === null ? null : user.user_data.recien_creada
          }
        },
        jwt: user.jwt
      }
    }
  }
)