import Usuario from "@/interfaces/Usuario";
import { useRef } from 'react'
import { useRouter } from "next/router";
import { deleteLocalCart } from "@/lib/Cart";

export default function UserNavigation({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const closeRef = useRef<HTMLLabelElement>(null)
  const logoutHandler = () => {
    deleteLocalCart()
    router.push('/api/logout')
  }
  const cancelHandler = () => {
    closeRef.current?.click()
  }
  
  return (
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              src={
                usuario.data?.avatar === null
                  ? "http://127.0.0.1:1337/uploads/default_avatar_94abc249c2.jpg"
                  : `http://127.0.0.1:1337${usuario.data?.avatar}`
              }
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li className="text-base font-bold">@{usuario.data?.username}</li>
          <li>
            <a className="justify-between" onClick={() => router.push('/protected/profile')}>
              Perfil
              <span className="badge">¡Nuevo!</span>
            </a>
          </li>
          <li>
            <label htmlFor="logout-modal">Cerrar sesión</label>
          </li>
        </ul>
      </div>
      <input type="checkbox" id="logout-modal" className="modal-toggle" />
      <label htmlFor="logout-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
        <label htmlFor="logout-modal" className="btn btn-sm btn-circle absolute right-2 top-2" ref={closeRef}>✕</label>
          <h3 className="text-lg font-bold">
            ¿Está seguro de que quiere cerrar sesión?
          </h3>
          <div className="py-4 mt-4 flex justify-evenly">
            <button onClick={logoutHandler} className="btn btn-error">Cerrar sesión</button>
            <button onClick={cancelHandler} className="btn btn-outline">Cancelar</button>
          </div>
        </label>
      </label>
    </div>
  );
}
