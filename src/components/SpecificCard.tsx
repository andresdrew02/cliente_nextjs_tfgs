import { CgDetailsMore } from 'react-icons/cg'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Link from 'next/link';

export default function SpecificCard({ oferta, cartHandler }: { oferta: any, cartHandler: Function }) {
  return (
    <div className="card w-96 h-[32rem] bg-base-300 shadow-xl">
      <figure>
        <img
          src={oferta.fotos === null ? 'https://previews.123rf.com/images/fordzolo/fordzolo1506/fordzolo150600296/41026708-example-white-stamp-text-on-red-backgroud.jpg' : `http://localhost:1337${oferta.fotos[0].url}`}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h1 className="card-title">
          {oferta.nombre}
          <div className="badge badge-secondary">
            {oferta.productos[0].categoria.titulo}
          </div>
          {oferta.productos.length >= 2 &&
            <>
              <div className="badge badge-secondary">
                {oferta.productos[1].categoria.titulo}
              </div>
              <div>
                {oferta.productos.length > 2 && '...'}
              </div>
            </>

          }
        </h1>
        <h2>
          {oferta.tienda.nombre}
        </h2>
        <p>{oferta.descripcion}</p>
        <div className='divider'></div>
        <div className="flex items-center gap-10">
          <Link href={`/market/${oferta.id}`}>
            <button className="btn gap-2 btn-outline">
              <CgDetailsMore className='text-2xl' />
              Ver mas
            </button>
          </Link>
          <p className="text-xl">{oferta.precio_oferta}€</p>
          <button className="btn btn-circle" onClick={() => cartHandler(oferta.id)}>
            <AiOutlineShoppingCart className='text-2xl' />
          </button>
        </div>
      </div>
    </div>
  );
}
