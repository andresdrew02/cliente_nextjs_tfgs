import { login } from "@/lib/api";
import { useContext, useState } from "react";
import Error from "../components/Error";
import { UserContext } from "@/context/userContext";
import { setLocalCookie } from "@/utils/cookies";
import { useRouter } from "next/router";
export default function LoginForm() {
  const { setUsuario } = useContext(UserContext);
  const router = useRouter();
  const [errorDetail, setErrorDetail] = useState<{
    usernameError: boolean;
    usernameErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
  }>({
    usernameError: false,
    usernameErrorMessage: "No puede dejar el usuario vacio",
    passwordError: false,
    passwordErrorMessage: "No puede dejar la contraseña vacia",
  });
  const [responseError, setResponseError] = useState<{
    error: boolean;
    msg: string;
  }>({
    error: false,
    msg: "",
  });

  const checkBlank = (str: string) => {
    return str.trim().length === 0;
  };

  interface formData {
    username: string;
    pwd: string;
  }

  const handleLogin = async (event: any) => {
    event.preventDefault();

    //reseteamos el objeto de error
    setErrorDetail({
      usernameError: false,
      usernameErrorMessage: "No puede dejar el usuario vacio",
      passwordError: false,
      passwordErrorMessage: "No puede dejar la contraseña vacia",
    });

    //reseteamos el objeto de error de la respuesta
    setResponseError({
      error: false,
      msg: "",
    });

    const data: formData = {
      username: (event.target.username as HTMLInputElement).value,
      pwd: (event.target.password as HTMLInputElement).value,
    };

    if (checkBlank(data.username)) {
      setErrorDetail({
        usernameError: true,
        usernameErrorMessage: errorDetail.usernameErrorMessage,
        passwordError: errorDetail.passwordError,
        passwordErrorMessage: errorDetail.passwordErrorMessage,
      });
      return;
    }
    if (checkBlank(data.pwd)) {
      setErrorDetail({
        usernameError: errorDetail.usernameError,
        usernameErrorMessage: errorDetail.usernameErrorMessage,
        passwordError: true,
        passwordErrorMessage: errorDetail.passwordErrorMessage,
      });
      return;
    }
    const res = await login(data);
    if (res.data === null && res.error !== null) {
      setResponseError({
        error: true,
        msg: res.error.message,
      });
    } else {
      //seteamos en el contexto del usuario la respuesta de la peticion
      setUsuario({
        data: {
          email: res.user.email,
          fecha_nacimiento: res.user.fecha_nacimiento,
          id: res.user.id,
          nombre_completo: res.user.nombre_completo,
          username: res.user.username,
          avatar: res.user.avatar === undefined ? null : res.user.avatar,
          recien_creada:
            res.user.recien_creada === undefined ||
            res.user.recien_creada === null
              ? null
              : res.user.recien_creada,
        },
      });
      //guardamos como cookie el token jwt
      setLocalCookie(res.jwt);
      router.push("/market");
    }
  };

  return (
    <div className="w-full max-w-md">
      {responseError.error && <Error msg={responseError.msg} />}
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Usuario o correo electrónico
          </label>
          <input
            className={
              !errorDetail.usernameError
                ? "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                : "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            }
            id="username"
            type="text"
            placeholder="Usuario o correo electrónico"
          />
          {errorDetail.usernameError && (
            <p className="text-red-500 text-xs italic">
              {errorDetail.usernameErrorMessage}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className={
              !errorDetail.passwordError
                ? "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                : "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            }
            id="password"
            type="password"
            placeholder="******************"
          />
          {errorDetail.passwordError && (
            <p className="text-red-500 text-xs italic">
              {errorDetail.passwordErrorMessage}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Iniciar sesión"
          />
          <a
            className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={() => router.push("/auth-portal/reset-password")}
          >
            ¿Has olvidado la contraseña?
          </a>
        </div>
        <div className="divider">O</div>
        <div className="w-full">
          <button
            type="button"
            className="flex items-center justify-center w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-md px-5 py-2.5 dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
            onClick={() => router.push('http://127.0.0.1:1337/api/connect/google')}
          >
            <svg
              className="w-5 h-5 mr-2 -ml-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Iniciar sesión con Google
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2023 Crearte. Todos los derechos reservados.
      </p>
    </div>
  );
}
