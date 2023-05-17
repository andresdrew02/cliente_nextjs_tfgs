import { CgDetailsMore } from 'react-icons/cg'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { addToCart } from '@/lib/Cart';
import Link from 'next/link';

export default function Card({ oferta, cartHandler }: { oferta: Oferta, cartHandler: Function }) {
  return (
    <div className="card w-96 h-[32rem] bg-base-300 shadow-xl">
      <figure>
        <img
          src={oferta.fotos.data === null ? 'https://previews.123rf.com/images/fordzolo/fordzolo1506/fordzolo150600296/41026708-example-white-stamp-text-on-red-backgroud.jpg' : `http://localhost:1337${oferta.fotos.data[0].attributes.url}`}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h1 className="card-title">
          {oferta.attributes.nombre}
          <div className="badge badge-secondary">
            {oferta.attributes.producto.data.attributes.categoria.data.attributes.titulo.substring(0, 1).toUpperCase() + oferta.attributes.producto.data.attributes.categoria.data.attributes.titulo.substring(1)}
          </div>
        </h1>
        <Link className='hover:underline' href={`/tienda/${oferta.attributes.tienda.data.attributes.slug}`}>{oferta.attributes.tienda.data.attributes.nombre}</Link>
        <div className='divider'></div>
        <div className="flex items-center gap-10">
          <button className="btn gap-2 btn-outline">
            <CgDetailsMore className='text-2xl' />
            Ver mas
          </button>
          <p className="text-xl">{oferta.attributes.precio_oferta}€</p>
          <button className="btn btn-circle" onClick={() => cartHandler(oferta.id)}>
            <AiOutlineShoppingCart className='text-2xl' />
          </button>
        </div>
      </div>
    </div>
  );
}
