import nookies from "nookies";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { getLocalCookie, removeLocalCookie } from "@/utils/cookies";
export default function logout() {
  const router = useRouter();
  const { usuario, setUsuario } = useContext(UserContext);
  setUsuario({
    data: null
  })
  removeLocalCookie()
  return <div>Cerrando sesión...</div>;
}

export function getServerSideProps(ctx: any) {
  nookies.destroy(ctx, "jwt", {
    path: '/'
  });
  return {
    redirect: {
      permanent: false,
      destination: "/market"
    }
  }
}
