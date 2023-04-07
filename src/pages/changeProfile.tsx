import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UserProvider, { UserContext } from "@/context/userContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import getServerSideProps from "@/lib/serverProps";
import Usuario from "@/interfaces/Usuario";
import {
  changeRecienCreado,
  updateProfilePicture,
  updateUserInfo,
} from "@/lib/api";
import { getLocalCookie } from "@/utils/cookies";
import Error from "@/components/Error";
import Success from "@/components/Success";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { useRouter } from "next/router";

export default function changeProfile({ user }: { user: Usuario | null }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const [okay, setOkay] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any>();
  const router = useRouter()

  useEffect(() => {
    if (user !== null && usuario.data === null) {
      setUsuario(user);
    }
  }, []);
  const handleSubmit = async (event: FormEvent) => {
    setOkay(false);
    setError(false);
    setLoading(true);
    event.preventDefault();
    const ok = await updateProfilePicture(files, getLocalCookie(), usuario);
    if (ok) {
      setOkay(true);
      updateUserInfo((user: Usuario) => {
        setUsuario(user);
        if (user.data?.recien_creada === 'true'){
          changeRecienCreado(getLocalCookie());
        }
      });
    } else {
      setError(true);
    }
    setLoading(false);
  };
  return (
    <>
      <Navbar usuario={usuario}></Navbar>
      <div
        className="text-lg flex items-center gap-2 rounded-md w-56 font-bold p-4  hover:cursor-pointer active:scale-95 transition-all"
        onClick={() => router.push("/market")}
      >
        <HiArrowUturnLeft className="text-2xl" />
        <p className="">Ir al mercado</p>
      </div>
      <div className="form-control w-full h-[30rem] flex justify-center items-center">
        <div className="w-1/2 mb-4">
          {error && (
            <Error msg="La subida del archivo no se ha podido realizar, inténtelo de nuevo mas tarde." />
          )}
          {okay && <Success msg="Foto de perfil cambiada correctamente" />}
        </div>
        <div>
          <h1 className="text-center text-3xl text-slate-800 font-bold">
            ¡Elige tu foto de perfil!
          </h1>
          <label className="label">
            <span className="label-text">¡Elige tu foto de perfil!</span>
          </label>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-4"
          >
            <input
              id="foto"
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => setFiles(e.target.files)}
            />
            <input
              type="submit"
              className="btn"
              value={loading ? "Cargando..." : "Establecer foto de perfil"}
              disabled={loading}
            />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
export { getServerSideProps };
