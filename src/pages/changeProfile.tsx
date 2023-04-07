import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UserProvider, { UserContext } from "@/context/userContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import getServerSideProps from "@/lib/serverProps";
import Usuario from "@/interfaces/Usuario";
import { updateProfilePicture } from "@/lib/api";
import { getLocalCookie } from "@/utils/cookies";

export default function changeProfile({ user }: { user: Usuario | null }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const [files, setFiles] = useState<any>()
  useEffect(() => {
    if (user !== null && usuario.data === null) {
      setUsuario(user);
    }
  }, []);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await updateProfilePicture(files,getLocalCookie())
  }
  return (
    <>
      <Navbar usuario={usuario}></Navbar>
      <div className="form-control w-full h-[35rem] flex justify-center items-center">
        <div>
            <h1 className="text-center text-3xl text-slate-800 font-bold">¡Elige tu foto de perfil!</h1>
          <label className="label">
            <span className="label-text">¡Elige tu foto de perfil!</span>
          </label>
          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
            <input
                id="foto"
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e)=> setFiles(e.target.files)}
            />
            <input type="submit" className="btn" value='Establecer foto de perfil'/>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
export { getServerSideProps };
