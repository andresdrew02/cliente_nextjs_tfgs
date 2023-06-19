import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(update);

async function update(req, response) {
  const user = req.session.user;
  const { redirect } = req.query

  const res = await (
    await fetch(`${API_URL}/users/me?populate=avatar&populate=direccion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
    })
  ).json();

  if (res.recien_creada) {
    await fetch(`${API_URL}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({ recien_creada: "false" }),
    });
  }

  const direction = res.direccion

  req.session.user = {
    jwt: user.jwt,
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
      recien_creada: false,
      avatar:
        res.avatar === undefined || res.avatar === null ? null : res.avatar.url,
      direccion: direction
    },
  };
  await req.session.save();

  return response.redirect(307, redirect === undefined ? "/market" : redirect);
}
