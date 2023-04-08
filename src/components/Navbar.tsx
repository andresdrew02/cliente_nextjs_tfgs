import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, useDisclosure } from "@chakra-ui/react";
import ContactForm from '../components/ContactForm'
import { useRouter } from "next/dist/client/router";
import Usuario from "@/interfaces/Usuario";
import UserNavigation from "./UserNavigation";

export default function Navbar( {usuario}:{usuario: Usuario} ) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  
  return (
    <div className="navbar bg-base-100 p-2 ">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" onClick={() => router.push('/')}>Crearte</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li tabIndex={0}>
            <a>
              Ofertas
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a onClick={() => router.push('/market')}>Buscar ofertas</a>
              </li>
              <li>
                <a>Subir una oferta</a>
              </li>
              <li>
                <a>Gestionar mis ofertas</a>
              </li>
            </ul>
          </li>
          <li tabIndex={0}>
            <a>
              Tiendas
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a onClick={() => router.push('/market')}>Buscar una tienda</a>
              </li>
              <li>
                <a>Gestionar mis tiendas</a>
              </li>
            </ul>
          </li>
          <li tabIndex={0}>
            <a>
              Atención al usuario
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a>Hacer un reporte</a>
              </li>
              <li>
                <a onClick={onOpen}>Solicitar ayuda</a>
              </li>
            </ul>
          </li>
          <li>
            {usuario.data !== null ? <UserNavigation usuario={usuario}/> : <button className="btn bg-primary border-none text-white" onClick={() => router.push('/auth-portal')}>Iniciar sesión</button>}
          </li>
        </ul>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="bg-base-300" roundedTop='2xl'>Formulario de soporte</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-base-300" roundedBottom='2xl'>
            <ContactForm/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
