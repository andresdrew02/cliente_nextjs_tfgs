import logo from '../img/logo.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function Footer() {
  const router = useRouter()
  return (
    <footer className="footer bg-base-200 p-10">
      <div className='w-full flex justify-center items-center'>
        <Image src={logo} alt='Logo de Crearte' className='max-w-[15rem] cursor-pointer' onClick={() => router.push('/')}/>
      </div>
      <div>
        <span className="footer-title">Create</span>
        <a className="link link-hover">Sobre nosotros</a>
        <a className="link link-hover">Contacto</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Términos de uso</a>
        <a className="link link-hover">Política de privacidad</a>
        <a className="link link-hover">Política de cookies</a>
      </div>
    </footer>
  );
}
