import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(editarProducto);
async function editarProducto(req, response) {
    const { jwt } = req.session.user;
    const { data, idProducto } = JSON.parse(req.body)
    const res = await fetch(`${API_URL}/productos/${idProducto}`,{
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(data)
    })
    return response.status(res.status).send("")
}
