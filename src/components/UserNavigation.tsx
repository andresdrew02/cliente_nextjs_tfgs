import Usuario from "@/interfaces/Usuario";
import { useRef } from 'react'
import { useRouter } from "next/router";

export default function UserNavigation({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const closeRef = useRef<HTMLLabelElement>(null)
  const logoutHandler = () => {
    router.push('/api/logout')
  }
  const cancelHandler = () => {
    closeRef.current?.click()
  }
  
  return (
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="badge badge-sm indicator-item">8</span>
          </div>
        </label>
        <div
          tabIndex={0}
          className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
        >
          <div className="card-body">
            <span className="font-bold text-lg">8 Productos</span>
            <span className="text-info">Subtotal: 999€</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-block">Ver carrito</button>
            </div>
          </div>
        </div>
      </div>
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
