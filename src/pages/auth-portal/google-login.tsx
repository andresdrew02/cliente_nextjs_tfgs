import { useRouter } from "next/router";
import nookies from "nookies";
//?id_token
export default function login() {
  return <div>Redireccionando...</div>;
}

export async function getServerSideProps(ctx: any) {
  const constructorObject = Object.entries(ctx.query);
  let base_url = "http://127.0.0.1:1337/api/auth/google/callback?";
  for (let i = 0; i < constructorObject.length; i++) {
    base_url += `${constructorObject[i][0]}=${constructorObject[i][1]}&`;
  }
  const res = await (await fetch(base_url)).json();
  if (!res.jwt) {
    return {
      redirect: {
        permanent: false,
        destination: "/logout",
      },
    };
  }
  nookies.set(ctx, "jwt", res.jwt, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  return {
    redirect: {
      permanent: false,
      destination: "/market",
    },
  };
}
