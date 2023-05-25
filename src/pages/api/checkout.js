import { withSessionRoute } from "../../lib/AuthSession/withSession";
import { API_URL } from "../../lib/api";

export default withSessionRoute(callback);

async function callback(req, response) {
  return response.status(200).send("")
}
