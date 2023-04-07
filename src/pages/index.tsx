import Footer from "@/components/Footer";
import Valor from "@/components/Valor";
import icon from "../img/icons/website-design-icon.svg";
import earth from "../img/icons/google-earth-icon.svg";
import quality from "../img/icons/services-icon.svg";
import { motion } from "framer-motion";
import Testimonial from "@/components/Testimonial";
import ContactForm from "@/components/ContactForm";
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://images.unsplash.com/photo-1623785796565-9dee9d56d5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80"
            className="max-w-sm h-full rounded-lg shadow-2xl lg:flex hidden"
          />
          <motion.div
            animate={{ x: [-100, 0] }}
            transition={{ ease: "easeIn", duration: 0.5 }}
          >
            <div>
              <h1 className="text-5xl font-bold">Crearte</h1>
              <p className="py-6 max-w-lg">
                Haz tu vida más creativa y apoya a artistas del mundo entero con
                Crearte, tu mercado para productos artesanales en línea.
              </p>
              <button onClick={() => router.push('/market')} className="btn btn-primary">Descubrir arte 🚀</button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="flex w-full p-10">
        <Valor
          img={icon}
          titulo="Pasión por la creatividad"
          valor="Creemos en la importancia de la creatividad y la autenticidad en la producción de productos artesanales únicos y de alta calidad."
        />
        <div className="divider divider-horizontal"></div>
        <Valor
          img={earth}
          titulo="Ética y responsabilidad social"
          valor="Fomentamos prácticas comerciales éticas y responsables, y nos comprometemos a apoyar a las comunidades y el medio ambiente."
        />
        <div className="divider divider-horizontal"></div>
        <Valor
          img={quality}
          titulo="Compromiso con la calidad"
          valor="Nos esforzamos por ofrecer productos artesanales de la más alta calidad, seleccionados cuidadosamente por su artesanía y diseño únicos"
        />
      </div>
      <div className="bg-primary flex mt-32">
        <Testimonial
          testimonio="Me encantó la calidad de los productos de esta empresa. Compré una pieza de joyería artesanal y quedé impresionado por el detalle y la artesanía. Definitivamente volveré a comprar aquí."
          usuario={{
            nombre: "Maria Teresa",
            imagen:
              "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        />
        <div className="divider divider-horizontal p-4"></div>
        <Testimonial
          testimonio="Hace poco descubrí esta empresa y me sorprendió encontrar una variedad tan amplia de productos artesanales. Me encanta la opción de encontrar productos únicos. ¡Recomiendo esta empresa!"
          usuario={{
            nombre: "John Doe",
            imagen:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          }}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full mt-32 p-10 gap-10">
        <div>
          <img
            src="https://images.unsplash.com/photo-1591256550014-150b0c0447bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="art image"
            className="rounded-xl max-w-xl"
          />
        </div>
        <div className="">
          <h1 className="text-2xl font-bold">
            ¡Apuntate a nuestros talleres de arte!
          </h1>
          <p className="mt-2">
            Crearte organiza talleres de arte y diseño para fomentar el
            aprendizaje y la creatividad en la comunidad. Por ejemplo, podrían
            ofrecer talleres de joyería artesanal, cerámica, bordado o tejido,
            impartidos por artesanos locales y diseñadores profesionales. Los
            talleres son para todas las edades y niveles de habilidad, y ofrecer
            una oportunidad para que los participantes aprendan nuevas
            habilidades mientras crean sus propias obras de arte únicas y
            auténticas.
          </p>
          <div className="divider"></div>
          <h1 className="mt-2 text-2xl font-bold">¡Ferias del arte!</h1>
          <p className="mt-2">
            Organizamos eventos de arte y diseño para fomentar la creatividad y
            la inspiración en nuestra comunidad. Nuestros talleres y ferias de
            arte destacan la autenticidad y calidad de las artesanías y diseños
            locales, y brindan oportunidades para que los artistas y artesanos
            puedan exhibir y vender sus productos. Cada evento que organizamos
            es único y personalizado. Trabajamos estrechamente con artistas,
            artesanos y diseñadores para crear experiencias únicas y atractivas
            que muestren su trabajo de manera impactante y efectiva.
          </p>
        </div>
      </div>
      <div className="flex w-full justify-center items-center p-10 mt-10">
        <div className="w-1/3">
          <h1 className="text-center text-2xl mb-4 font-bold">
            ¡Contacta con nosotros!
          </h1>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
