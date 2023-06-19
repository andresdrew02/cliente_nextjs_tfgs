import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(crearValoracion);
async function crearValoracion(req, response) {
    const { jwt } = req.session.user;
    const { valoracion, comentario, slug } = JSON.parse(req.body)
    console.log(valoracion, comentario)

    if (!jwt) {
        return response.status(403).send("")
    }

    const res = await fetch(`${API_URL}/tienda/${slug}/valorar`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
            valoracion: valoracion,
            comentario:comentario
        })
    })

    return response.status(res.status).send("")
}
