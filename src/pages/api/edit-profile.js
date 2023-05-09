import { withSessionRoute } from "../../lib/config/withSession";
import { API_URL } from "../../lib/api";
export default withSessionRoute(createSessionRoute);

const allowedParams = ["nombre_completo", "pais", "ciudad", "poblacion", "via", "calle", "num", "cp", "portal"]

async function createSessionRoute(req, resp) {
  const jwt = req.session.user.jwt;

  if (jwt === undefined || null) {
    //no autorizado
    return resp.status(401).send("")
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    for (const [key, value] of Object.entries(body)) {
      if (!allowedParams.includes(key)) {
        //bad request
        return resp.status(400).send("")
      }
    }
    const response = await fetch(`${API_URL}/user/me/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(body),
    });

    if (response.ok){
      return resp.redirect(
        307,
        "/api/update?redirect=/protected/profile"
      );
    }{
      //error inesperado
      return resp.redirect(
        307,
        "/error/errorPage?msg=Ha%20ocurrido%20un%20error%20inesperado"
      );
    }
  }
  return resp.status(404).send("")
}
