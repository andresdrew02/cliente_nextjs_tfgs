import { withSessionRoute } from "../../lib/AuthSession/withSession";

export default withSessionRoute(logout);

async function logout(req, res) {
    await req.session.destroy();
    return res.redirect(307,'/market')
}