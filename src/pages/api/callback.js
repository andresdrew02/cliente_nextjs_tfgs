import { withSessionRoute } from "../../lib/config/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(logout);

async function logout(req, response) {
  const constructorObject = Object.entries(req.query);
  let base_url = "http://127.0.0.1:1337/api/auth/google/callback?";
  for (let i = 0; i < constructorObject.length; i++) {
    base_url += `${constructorObject[i][0]}=${constructorObject[i][1]}&`;
  }
  try {
    const jwtres = await (await fetch(base_url)).json();

    if (jwtres === null || jwtres.jwt === undefined || jwtres.jwt === null) {
      return response.redirect(
        307,
        "/error/errorPage?msg=Ha%20ocurrido%20un%20error%20inesperado"
      );
    }

    //recogemos los datos del usuario para guardarlos en la sesión
    const res = await (
      await fetch(`${API_URL}/users/me?populate=avatar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtres?.jwt}`,
        },
      })
    ).json();

    //guardamos el usuario en la sesión
    req.session.user = {
      jwt: jwtres?.jwt,
      user_data: {
        id: res.id,
        username: res.username,
        email: res.email,
        provider: res.provider,
        confirmed: res.confirmed,
        blocked: res.blocked,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        nombre_completo: res.nombre_completo,
        fecha_nacimiento: res.fecha_nacimiento,
        recien_creada: res.recien_creada,
        avatar:
          res.avatar === undefined || res.avatar === null
            ? null
            : res.avatar.url,
      },
    };
    await req.session.save();
    return response.redirect(307, "/market");
  } catch (error) {
    return response.redirect(
      307,
      "/error/errorPage?msg=Ha%20ocurrido%20un%20error%20inesperado"
    );
  }
}
