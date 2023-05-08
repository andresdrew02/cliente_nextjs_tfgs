import Usuario from "@/interfaces/Usuario";
import { getLocalCookie } from "@/utils/cookies";

export const API_URL = "http://127.0.0.1:1337/api";
export async function postContactForm(body: {}) {
  const response = await fetch(`${API_URL}/contactos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: body }),
  });
  const res = response.ok;
  return res;
}

export async function postRegisterForm(body: {}) {
  const response = await fetch(`${API_URL}/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const res = await response.json();
  return res;
}

export async function getProductsByName(
  str: string | null,
  rango: number[],
  categoria: string | null
) {
  if (str === null) {
    const response = await fetch(
      `${API_URL}/ofertas?filters[precio_oferta][$between]=${
        rango[0]
      }&filters[precio_oferta][$between]=${rango[1]}${
        categoria !== null
          ? `&filters[producto][categoria][$containsi]=${categoria}`
          : ""
      }&populate=*`
    );
    const res = await response.json();
    const arrOfertas: Oferta[] = [];
    res.data.map((e: any) => {
      const oferta: Oferta = {
        id: e.id,
        attributes: {
          stock: e.attributes.stock,
          nombre: e.attributes.nombre,
          descripcion: e.attributes.descripcion,
          precio_oferta: e.attributes.precio_oferta,
          producto: e.attributes.producto,
          tienda: e.attributes.tienda,
        },
        fotos: e.attributes.fotos,
      };
      arrOfertas.push(oferta);
    });
    return arrOfertas;
  }

  const response = await fetch(
    `${API_URL}/ofertas?filters[$or][0][nombre][$containsi]=${str}&filters[$or][1][tienda][nombre][$containsi]=${str}&filters[precio_oferta][$between]=${
      rango[0]
    }&filters[precio_oferta][$between]=${rango[1]}${
      categoria !== null
        ? `&filters[producto][categoria][$containsi]=${categoria}`
        : ""
    }&populate=*`
  );
  const res = await response.json();
  const arrOfertas: Oferta[] = [];
  res.data.map((e: any) => {
    const oferta: Oferta = {
      id: e.id,
      attributes: {
        stock: e.attributes.stock,
        nombre: e.attributes.nombre,
        descripcion: e.attributes.descripcion,
        precio_oferta: e.attributes.precio_oferta,
        producto: e.attributes.producto,
        tienda: e.attributes.tienda,
      },
      fotos: e.attributes.fotos,
    };
    arrOfertas.push(oferta);
  });
  return arrOfertas;
}

/* export async function login(data: { username: string; pwd: string }) {
  const response = await fetch(`${API_URL}/auth/local/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: data.username, password: data.pwd }),
  });
  const res = await response.json();
  return res;
} */

export async function login(data: { username: string; pwd:string}){
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(data)
  })
  return response.status
}

export async function changeRecienCreado(jwt: string) {
  const response = await fetch(`${API_URL}/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ recien_creada: "false" }),
  });
  return response.ok;
}

export async function updateProfilePicture(
  event: any,
  jwt: string,
  usuario: Usuario
) {

  const formData = new FormData();
  formData.append("files", event[0]);
  formData.append(
    "refId",
    usuario.data?.id === undefined ? "" : usuario.data?.id.toString()
  );
  formData.append("ref", "plugin::users-permissions.user");
  formData.append("field", "avatar");

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });
  return response.ok;
}

export async function resetUserPassword(formData: FormData){
  const body = Object.fromEntries(formData.entries());
  try{
    const response = await(await fetch(`${API_URL}/auth/forgot-password`,{
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify(body)
    })).json()
    if (response.ok !== undefined && response.ok === true){
      return true
    }
    return false
  }
  catch(err){
    return false
  }
}

export async function postResetPassword(formData: FormData, code: string){
  /**code: 'privateCode', // code contained in the reset link of step 3.
    password: 'userNewPassword',
    passwordConfirmation: 'userNewPassword', */
    formData.append("code",code)
    const body = Object.fromEntries(formData.entries())
    const response = await(await fetch(`${API_URL}/auth/reset-password/`,{
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify(body)
    })).json()
    return response
}
