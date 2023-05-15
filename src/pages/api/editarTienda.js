import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(crearTienda);

const checkName = (str) => {
    const regexp = /^[a-zA-Z ]{10,32}$/
    const checker = new RegExp(regexp)
    return checker.test(str)
}

async function crearTienda(req, response) {
    const { jwt } = req.session.user;
    const { id, nombre, descripcion } = JSON.parse(req.body)

    if (!jwt) {
        //borrar sesión y redireccionar
        return response.status(403).send("")
    }

    if (!id, !nombre || !descripcion){
        return response.status(400).send("")
    }

    if (!checkName(nombre)) {
        return response.status(400).send("")
    }

    const res = await fetch(`${API_URL}/tiendas/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({nombre: nombre, descripcion: descripcion})
    })
    
    return response.status(res.status).send("")
}
