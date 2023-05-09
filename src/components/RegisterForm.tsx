import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { postRegisterForm } from "../lib/api";
import Error from "./Error";
import { CountrySelector } from "./CountrySelector";

export default function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    setResponseError("");

    if (data.paswd !== data.pswdconf) {
      setError(true);
      setLoading(false);
      return;
    }
    const body = {
      username: data.usuario,
      nombre_completo: data.nombrecompleto,
      fecha_nacimiento: data.fecha,
      email: data.email,
      password: data.paswd,
      direccion: {
        calle: data.calle,
        tipo_via: data.via,
        numero: data.num,
        portal: data.portal,
        cp: data.cp,
        ciudad: data.ciudad,
        poblacion: data.poblacion,
        pais: data.pais,
      },
    };

    const response = await postRegisterForm(body);
    if (response.error !== undefined && response.error !== null) {
      setResponseError(response.error.name + ": " + response.error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {responseError !== "" && (
        <div className="p-4">
          <Error msg={responseError} />
        </div>
      )}
      {success && (
        <div className="alert shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              ¡Usuario registrado correctamente!, para iniciar sesión, confirme
              su cuenta con un link que hemos enviado al email especificado.
            </span>
          </div>
        </div>
      )}
      <FormControl isInvalid={errors === null}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel>
              Nombre de usuario <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("usuario", {
                required: "Debe de introducir un nombre de usuario",
              })}
            />
            {!errors?.usuario ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">
                {errors?.usuario.message?.toString()}
              </h1>
            )}
          </div>
          <div>
            <FormLabel>
              Nombre completo <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("nombrecompleto", {
                required: "Debe de introducir su nombre completo",
              })}
            />
            {!errors?.nombrecompleto ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">
                {errors?.nombrecompleto.message?.toString()}
              </h1>
            )}
          </div>
        </div>
        <div>
          <FormLabel>
            Email <span className="text-red-600">*</span>
          </FormLabel>
          <Input
            type="email"
            borderColor="blue.200"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {!errors?.email ? (
            <FormHelperText>
              Este es el email al que le enviaremos una respuesta.
            </FormHelperText>
          ) : (
            <h1 className="text-red-600 text-sm">{errors?.email.message?.toString()}</h1>
          )}
        </div>
        <div>
          <FormLabel>
            Fecha de nacimiento <span className="text-red-600">*</span>
          </FormLabel>
          <Input
            type="date"
            borderColor="blue.200"
            {...register("fecha", {
              required: "Debe introducir su fecha de nacimiento",
            })}
          />
          {!errors?.fecha ? (
            ""
          ) : (
            <h1 className="text-red-600 text-sm">{errors?.fecha.message?.toString()}</h1>
          )}
        </div>
        <div>
          {error && (
            <div className="alert alert-warning shadow-lg mt-4 mb-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>¡Las contraseñas no coinciden!</span>
              </div>
            </div>
          )}
          <FormLabel>
            Contraseña <span className="text-red-600">*</span>
          </FormLabel>
          <Input
            type="password"
            borderColor="blue.200"
            {...register("paswd", {
              required: "Debe de introducir su contraseña",
            })}
          />
          {!errors?.paswd ? (
            ""
          ) : (
            <h1 className="text-red-600 text-sm">{errors?.paswd.message?.toString()}</h1>
          )}
        </div>
        <div>
          <FormLabel>
            Confirmar contraseña <span className="text-red-600">*</span>
          </FormLabel>
          <Input
            type="password"
            borderColor="blue.200"
            {...register("pswdconf", {
              required: "Debe de introducir su contraseña",
            })}
          />
          {!errors?.pswdconf ? (
            ""
          ) : (
            <h1 className="text-red-600 text-sm">{errors?.pswdconf.message?.toString()}</h1>
          )}
        </div>
        <div>
          <FormLabel>
            Pais <span className="text-red-600">*</span>
          </FormLabel>
          <select
            className="select select-bordered w-full max-w-s"
            {...register("pais")}
          >
            <CountrySelector/>
          </select>
        </div>
        <p className="mt-2 mb-2 text-gray-500 font-bold">Dirección</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel>
              Ciudad <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("ciudad", {
                required: "Debe de introducir su ciudad",
              })}
            />
            {!errors?.ciudad ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.ciudad.message?.toString()}</h1>
            )}
          </div>
          <div>
            <FormLabel>Población <span className="text-red-600">*</span></FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("poblacion",{
                required: 'Debe de introducir su población'
              })}
              onClick={(e) => console.log(e)}
            />
            {!errors?.poblacion ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">
                {errors?.poblacion.message?.toString()}
              </h1>
            )}
          </div>
          <div>
            <FormLabel>
              Tipo de via <span className="text-red-600">*</span>
            </FormLabel>
            <select
              className="select select-bordered w-full max-w-s"
              {...register("via")}
            >
              <option value="calle">Calle</option>
              <option value="plaza">Plaza</option>
              <option value="callejon">Callejón</option>
              <option value="urbanizacion">Urbanización</option>
            </select>
            {!errors?.via ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.via.message?.toString()}</h1>
            )}
          </div>
          <div>
            <FormLabel>
              Nombre de via <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("calle", {
                required: "Debe de introducir que nombre via",
              })}
            />
            {!errors?.calle ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.calle.message?.toString()}</h1>
            )}
          </div>
          <div>
            <FormLabel>
              Número <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("num", {
                required: "Debe de introducir su número de dirección",
              })}
            />
            {!errors?.num ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.num.message?.toString()}</h1>
            )}
          </div>
          <div>
            <FormLabel>
              Código postal <span className="text-red-600">*</span>
            </FormLabel>
            <Input
              type="number"
              borderColor="blue.200"
              {...register("cp", {
                required: "Debe de introducir su código postal",
              })}
            />
            {!errors?.cp ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.cp.message?.toString()}</h1>
            )}
          </div>
          <div>
            <FormLabel optionalIndicator>Portal</FormLabel>
            <Input type="text" borderColor="blue.200" {...register("portal")} />
            {!errors?.portal ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.portal.message?.toString()}</h1>
            )}
          </div>
          <div></div>
          <div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Acepto los términos y condiciones</span>
                <input type="checkbox" className="checkbox" {...register("terminos",{required: "Debes aceptar los términos y condiciones para poder registrarte."})}/>
              </label>
            </div>
            {!errors?.terminos ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.terminos.message?.toString()}</h1>
            )}
          </div>
        </div>
        <Button
          isLoading={loading}
          className="mt-4 w-full"
          type="submit"
          colorScheme="blue"
        >
          🔑 Enviar
        </Button>
      </FormControl>
    </form>
  );
}
