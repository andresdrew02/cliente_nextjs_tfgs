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

export async function login(data: { username: string; pwd: string }) {
  const response = await fetch(`${API_URL}/auth/local/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: data.username, password: data.pwd }),
  });
  const res = await response.json();
  return res;
}

export async function getUserInfo(jwt: string) {
  const response = await (
    await fetch(`${API_URL}/users/me?populate=avatar`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
  ).json();
  return response;
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

export async function updateProfilePicture(files: any, jwt: string) {
  const formData = new FormData();
  formData.append("files", files[0]);

  const response = await (
    await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}`, },
      body: JSON.stringify(formData),
    })
  ).json();
  console.log(response);
}
