import { withSessionRoute } from "../../lib/config/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(changePassword);

async function changePassword(req, response) {
    const jwt = req.session.user.jwt;
    const { actual, pw1, pw2 } = JSON.parse(req.body)

    try {
        const res =
            await fetch(`${API_URL}/user/me/changePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    currentPassword: actual,
                    password: pw1,
                    passwordConfirmation: pw2
                })
            })

        if (res.ok){
            return response.status(200).send("")
        }else{
            const resData = await res.json()
            return response.status(resData.error.status).send(resData.error)
        }
    }
    catch (err) {
        return response.status(400).send({error:{message: 'Ha ocurrido un error inesperado'}})
    }
}
