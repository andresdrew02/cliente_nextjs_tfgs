import { CgDetailsMore } from 'react-icons/cg'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { addToCart } from '@/lib/Cart';
import Link from 'next/link';

export default function Card({ oferta, cartHandler }: { oferta: Oferta, cartHandler: Function }) {
  return (
    <div className="card w-80 md:w-96 h-[32rem] bg-base-300 shadow-xl">
      <figure>
        <img
          src={oferta.fotos.data === null ? 'https://previews.123rf.com/images/fordzolo/fordzolo1506/fordzolo150600296/41026708-example-white-stamp-text-on-red-backgroud.jpg' : `http://localhost:1337${oferta.fotos.data[0].attributes.url}`}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h1 className="font-bold">
          {oferta.attributes.nombre}
          <div className="badge badge-secondary ml-2">
            {oferta.attributes.productos.data[0].attributes.categoria.data.attributes.titulo}
          </div>
          {oferta.attributes.productos.data.length >= 2 &&
            <>
              <div className="badge badge-secondary ml-2">
                {oferta.attributes.productos.data[1].attributes.categoria.data.attributes.titulo}
              </div>
              <div>
                {oferta.attributes.productos.data.length > 2 && '...'}
              </div>
            </>

          }
        </h1>
        <Link className='hover:underline' href={`/tienda/${oferta.attributes.tienda.data.attributes.slug}`}>{oferta.attributes.tienda.data.attributes.nombre}</Link>
        <div className='divider'></div>
        <div className="flex items-center gap-2 md:gap-10">
          <Link href={`/market/${oferta.id}`}>
            <button className="btn gap-2 btn-outline">
              <CgDetailsMore className='text-2xl' />
              Ver mas
            </button>
          </Link>
          <p className="text-xl">{oferta.attributes.precio_oferta}€</p>
          <button className="btn btn-circle" onClick={() => cartHandler(oferta.id)}>
            <AiOutlineShoppingCart className='text-2xl' />
          </button>
        </div>
      </div>
    </div>
  );
}
