import { withSessionRoute } from "../../lib/config/withSession";
import { API_URL } from "../../lib/api";
import { NextResponse } from "next/server";

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, resp) {
  if (req.method === "POST") {
    const { username, pwd } = req.body;
    if (username !== null || (username !== "" && pwd !== null && pwd !== "")) {
      const response = await fetch(`${API_URL}/auth/local/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password: pwd }),
      });
      const res = await response.json();
      
      if (res.data === null || res.json === null || res.user === null) {
        return resp.status(403).send("")
      }
      
      let avatar = null
      let direction = null

      if (res.user.avatar === undefined || res.user.avatar === null){
        const extraInfo = await (
          await fetch(`${API_URL}/users/me?populate=avatar&populate=direccion`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.jwt}`,
            },
          })
        ).json();
        avatar = extraInfo.avatar === undefined || extraInfo.avatar === null ? null : extraInfo.avatar.url
        direction = extraInfo.direccion
      }
      req.session.user = {
        jwt: res.jwt,
        user_data: {
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
          provider: res.user.provider,
          confirmed: res.user.confirmed,
          blocked: res.user.blocked,
          createdAt: res.user.createdAt,
          updatedAt: res.user.updatedAt,
          nombre_completo: res.user.nombre_completo,
          fecha_nacimiento: res.user.fecha_nacimiento,
          recien_creada: res.user.recien_creada,
          avatar: avatar,
          direccion: direction
        },
      };
      await req.session.save();
      return resp.status(200).send("")
    }
  }
  return resp.status(404).send("")
}
