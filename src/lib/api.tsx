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
  categoria: string | null,
  page: number = 1
) {
  if (str === null) {
    const response = await fetch(
      `${API_URL}/ofertas?filters[precio_oferta][$between]=${rango[0]
      }&filters[precio_oferta][$between]=${rango[1]}${categoria !== null
        ? `&filters[productos][categoria][titulo][$containsi]=${categoria}`
        : ""
      }&populate=tienda&populate=productos&populate=fotos&populate=productos.categoria&pagination[page]=${page}&pagination[pageSize]=6`
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
          productos: e.attributes.productos,
          tienda: e.attributes.tienda,
        },
        fotos: e.attributes.fotos,
      };
      arrOfertas.push(oferta);
    });
    return {
      meta: res.meta,
      ofertas: arrOfertas
    };
  }

  const response = await fetch(
    `${API_URL}/ofertas?filters[$or][0][nombre][$containsi]=${str}&filters[$or][1][tienda][nombre][$containsi]=${str}&filters[precio_oferta][$between]=${rango[0]
    }&filters[precio_oferta][$between]=${rango[1]}${categoria !== null
      ? `&filters[productos][categoria][titulo][$containsi]=${categoria}`
      : ""
    }&populate=tienda&populate=productos&populate=fotos&populate=productos.categoria&pagination[page]=${page}&pagination[pageSize]=6`
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
        productos: e.attributes.productos,
        tienda: e.attributes.tienda,
      },
      fotos: e.attributes.fotos,
    };
    arrOfertas.push(oferta);
  });
  return {
    meta: res.meta,
    ofertas: arrOfertas
  };
}

export async function login(data: { username: string; pwd: string }) {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
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

  if (!event){
    return
  }

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

export async function resetUserPassword(formData: FormData) {
  const body = Object.fromEntries(formData.entries());
  try {
    const response = await (await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })).json()
    if (response.ok !== undefined && response.ok === true) {
      return true
    }
    return false
  }
  catch (err) {
    return false
  }
}

export async function postResetPassword(formData: FormData, code: string) {
  formData.append("code", code)
  const body = Object.fromEntries(formData.entries())
  const response = await (await fetch(`${API_URL}/auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })).json()
  return response
}

export async function getAllCategorias() {
  const response = await (await fetch(`${API_URL}/categorias`)).json()
  return response
}

export async function deleteOferta(id: string, jwt: string, slug: string | undefined | string[]) {
  if (slug === undefined || Array.isArray(slug)) {
    return false
  }
  const response = await fetch(`${API_URL}/ofertas/${id}?slug=${slug}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    }
  })
  return response.ok
}

export async function getOfertaPorId(id: string | string[] | undefined) {
  type ofertaResponse = {
    success: boolean
    data?: Oferta
    errorMsg?: String
  }

  const genericResponse: ofertaResponse = {
    success: false,
    errorMsg: 'Ha ocurrido un error al ver la oferta'
  }

  if (!id || Array.isArray(id)) {
    return genericResponse
  }

  if (Number.isNaN(parseInt(id))) {
    const response: ofertaResponse = {
      success: false,
      errorMsg: "El ID de la oferta debe de ser un número"
    }
    return response
  }

  const oferta = await (await fetch(`${API_URL}/ofertas/${id}?populate=tienda&populate=fotos&populate=productos&populate=productos.categoria`)).json()
  if (oferta.data === null) {
    const response: ofertaResponse = {
      success: false,
      errorMsg: "No se ha encontrado ninguna oferta"
    }
    return response
  }
  const response: ofertaResponse = {
    success: true,
    data: oferta.data
  }
  return response
}

export async function checkOut(ofertas: any[], jwt: string, cb: Function) {
  type requestBody = [{
    idOferta: number
    cantidad: number
  }?]

  if (!Array.isArray(ofertas) || ofertas.length <= 0) {
    return
  }

  const idOfertasCantidad: requestBody = []

  ofertas.map(e => idOfertasCantidad.push({
    cantidad: e.cantidad,
    idOferta: e.oferta.data.id
  }))

  const response = await (await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(idOfertasCantidad)
  })).json()
  cb(response)
}