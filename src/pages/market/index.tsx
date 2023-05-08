import Navbar from "@/components/Navbar";
import Searchbar from "@/components/Searchbar";
import { changeRecienCreado, getProductsByName } from "../../lib/api";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Spinner } from "@chakra-ui/react";
import Footer from "@/components/Footer";
import { evaluateOrder } from "@/utils/ordering";
import { getServerSideProps } from "@/lib/serverProps";
import Usuario from "@/interfaces/Usuario";
import { useRouter } from 'next/router'

export default function index({ user, jwt }: { user: Usuario | null, jwt: string }) {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [maxPrecio, setMaxPrecio] = useState<number>(100000);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<boolean>(false);
  const router = useRouter()

  const laterAvatarHandler = async () => {
    setAvatar(false)
    router.push('/api/update')
    if (!await changeRecienCreado(jwt)){
      router.push('/market')
    }
  }

  useEffect(() => {
    const initFetching = async () => {
      const maxres = await fetch("http://localhost:1337/api/maxOfertas");
      const catres = await fetch("http://localhost:1337/api/todasCategorias");
      const max = await maxres.json();
      const cats = await catres.json();
      setMaxPrecio(max);
      setCategorias(cats);
    };
    initFetching();

    if (user !== null && user.data?.recien_creada === "true") {
      setAvatar(true)
    }
  }, []);

  const handleSearch = async (
    str: string,
    priceRange: number[],
    categoria: string | null,
    order: string | null
  ) => {
    setLoading(true);

    //recuperamos las ofertas y las seteamos en el estado
    const res = await getProductsByName(str, priceRange, categoria);
    setOfertas(evaluateOrder(order, res));
    setLoading(false);
  };

  const handleOrder = (order: string | null) => {
    /*
      Si le pasamos el array entero ordenado, react lo interpreta como que es el mismo array por lo cual 
      no refresca el estado de este, y no se hace el refresh de los components, por lo cual tenemos que
      usar el spread operator para que lo interprete como un nuevo array y actualice el DOM
    */
    setOfertas([...evaluateOrder(order, ofertas)]);
  };

  return (
    <>
      <div>
        {/* Modal para elegir avatar si es una cuenta recien creada */}
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-6" className="modal-toggle" checked={avatar}/>
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              ¡Bienvenido a Crearte!
            </h3>
            <p className="py-4">
              Empieza a compartir tu arte con todo el mundo y a encontrar articulos artesanales de la mayor calidad, pero antes.
            </p>
            <div>
              ¿Desea establecer una foto de perfil?
            </div>
            <div className="modal-action flex justify-evenly items-center">
              <div className="cursor-pointer" onClick={laterAvatarHandler}>❌ Quizá mas adelante</div>
              <button className="btn" onClick={() => router.push('/protected/profile/changeProfile')}>¡Claro!</button>
            </div>
          </div>
        </div>

        <Navbar usuario={user === null ? {data: null} : user} />
        <h1 className="text-center p-10 mt-10 text-4xl font-bold">
          ¡Empieza a buscar ahora!
        </h1>
        <div className="w-full p-10">
          <Searchbar
            cb={handleSearch}
            maxPrecio={maxPrecio}
            order={handleOrder}
            categorias={categorias}
          />
        </div>
        <div
          className={
            loading
              ? "w-full h-24 flex justify-center items-center"
              : "p-10 grid grid-cols-3"
          }
        >
          {!loading &&
            ofertas !== null &&
            ofertas.map((e) => <Card oferta={e} />)}
          {loading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export { getServerSideProps };
