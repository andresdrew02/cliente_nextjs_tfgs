import { CgDetailsMore } from 'react-icons/cg'
import { AiOutlineShoppingCart } from 'react-icons/ai'

export default function Card({ oferta }: { oferta: Oferta }) {
  return (
    <div className="card w-96 h-[32rem] bg-base-300 shadow-xl">
      <figure>
        <img
          src={oferta.fotos.data === null ? 'https://previews.123rf.com/images/fordzolo/fordzolo1506/fordzolo150600296/41026708-example-white-stamp-text-on-red-backgroud.jpg' : `http://localhost:1337${oferta.fotos.data[0].attributes.url}`}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {oferta.attributes.nombre}
          <div className="badge badge-secondary">
            {oferta.attributes.producto.data.attributes.categoria.substring(0,1).toUpperCase()+oferta.attributes.producto.data.attributes.categoria.substring(1)}
          </div>
        </h2>
        <p>{oferta.attributes.descripcion}</p>
        <div className='divider'></div>
        <div className="flex items-center gap-10">
          <button className="btn gap-2 btn-outline">
            <CgDetailsMore className='text-2xl'/>
            Ver mas
          </button>
          <p className="text-xl">{oferta.attributes.precio_oferta}€</p>
          <button className="btn btn-circle">
            <AiOutlineShoppingCart className='text-2xl'/>
          </button>
        </div>
      </div>
    </div>
  );
}
