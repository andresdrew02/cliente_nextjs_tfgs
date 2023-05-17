import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(editarTienda);
const numberRegex = /^\+?\d{1,3}[-.\s]?\(?\d{1,}\)?[-.\s]?\d{1,}[-.\s]?\d{1,}[-.\s]?\d{1,}$/
const nameRegex = /^[a-zA-Z ]{10,32}$/
const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const checkRegexp = (str, regexp) => {
    const checker = new RegExp(regexp)
    return checker.test(str)
}

async function editarTienda(req, response) {
    const { jwt } = req.session.user;
    const { id, nombre, descripcion, telefono, email } = JSON.parse(req.body)

    if (!jwt) {
        //borrar sesión y redireccionar
        return response.status(403).send("")
    }

    if (!id, !nombre || !descripcion){
        return response.status(400).send("")
    }

    if (!checkRegexp(nombre,nameRegex)) {
        return response.status(400).send("")
    }


    if (telefono !== '' && !checkRegexp(telefono,numberRegex)){
        return response.status(400).send("")
    }

    if (email !== '' && !checkRegexp(email,mailRegex)){
        return response.status(400).send("")
    }

    const res = await fetch(`${API_URL}/tiendas/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({nombre: nombre, descripcion: descripcion, email: email, telefono:telefono})
    })
    
    return response.status(res.status).send("")
}
