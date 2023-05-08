import { withSessionRoute } from '../../lib/config/withSession';

export default withSessionRoute(logout);

async function logout(req, res) {
    req.session.destroy();
    return res.redirect(307,'/market')
}