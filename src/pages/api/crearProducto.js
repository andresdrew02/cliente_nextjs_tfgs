import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(crearProducto);
const decimalRegex = /^\d+(\.\d+)?$/
const numberRegex = /^\d+$/
const nameRegex = /^.{5,50}$/
const descriptionRegex = /^[a-zA-Z0-9!@#$%^&ñÑ*()_+={[}\]|\\:;"'<,>.?/ -]{50,500}$/

const checkRegexp = (str, regexp) => {
    const checker = new RegExp(regexp)
    return checker.test(str)
}

async function crearProducto(req, response) {
    const { jwt } = req.session.user;
    const { idTienda, data: { nombre, descripcion, ppu, categoria } } = JSON.parse(req.body)
    let ppuFinal = 0

    if (!jwt) {
        return response.status(403).send("")
    }

    if (!nombre || !descripcion, !categoria, !idTienda){
        return response.status(400).send("")
    }

    if (ppu === undefined || ppu === null || ppu.trim() === ''){
        ppuFinal = 0
    }else{
        ppuFinal = ppu
    }

    if (!checkRegexp(nombre,nameRegex) || !checkRegexp(descripcion,descriptionRegex) || !checkRegexp(ppuFinal,decimalRegex) || !checkRegexp(categoria,numberRegex) || !checkRegexp(idTienda,numberRegex)){
        return response.status(400).send("")
    }

    const sanitizedData = {
        nombre: nombre,
        descripcion: descripcion,
        ppu: ppuFinal,
        categoria: categoria,
        idTienda: idTienda
    }

    const res = await fetch(`${API_URL}/productos`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(sanitizedData)
    })

    return response.status(res.status).send("")
}
