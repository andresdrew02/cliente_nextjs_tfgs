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
import Error from "../components/Error";

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
                {errors?.usuario.message}
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
                {errors?.nombrecompleto.message}
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
            <h1 className="text-red-600 text-sm">{errors?.email.message}</h1>
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
            <h1 className="text-red-600 text-sm">{errors?.fecha.message}</h1>
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
            <h1 className="text-red-600 text-sm">{errors?.paswd.message}</h1>
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
            <h1 className="text-red-600 text-sm">{errors?.pswdconf.message}</h1>
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
            <option disabled selected>
              Elige tu pais de origen
            </option>
            <option value="AF">Afganistán</option>
            <option value="AL">Albania</option>
            <option value="DE">Alemania</option>
            <option value="AD">Andorra</option>
            <option value="AO">Angola</option>
            <option value="AI">Anguilla</option>
            <option value="AQ">Antártida</option>
            <option value="AG">Antigua y Barbuda</option>
            <option value="AN">Antillas Holandesas</option>
            <option value="SA">Arabia Saudí</option>
            <option value="DZ">Argelia</option>
            <option value="AR">Argentina</option>
            <option value="AM">Armenia</option>
            <option value="AW">Aruba</option>
            <option value="AU">Australia</option>
            <option value="AT">Austria</option>
            <option value="AZ">Azerbaiyán</option>
            <option value="BS">Bahamas</option>
            <option value="BH">Bahrein</option>
            <option value="BD">Bangladesh</option>
            <option value="BB">Barbados</option>
            <option value="BE">Bélgica</option>
            <option value="BZ">Belice</option>
            <option value="BJ">Benin</option>
            <option value="BM">Bermudas</option>
            <option value="BY">Bielorrusia</option>
            <option value="MM">Birmania</option>
            <option value="BO">Bolivia</option>
            <option value="BA">Bosnia y Herzegovina</option>
            <option value="BW">Botswana</option>
            <option value="BR">Brasil</option>
            <option value="BN">Brunei</option>
            <option value="BG">Bulgaria</option>
            <option value="BF">Burkina Faso</option>
            <option value="BI">Burundi</option>
            <option value="BT">Bután</option>
            <option value="CV">Cabo Verde</option>
            <option value="KH">Camboya</option>
            <option value="CM">Camerún</option>
            <option value="CA">Canadá</option>
            <option value="TD">Chad</option>
            <option value="CL">Chile</option>
            <option value="CN">China</option>
            <option value="CY">Chipre</option>
            <option value="VA">Ciudad del Vaticano (Santa Sede)</option>
            <option value="CO">Colombia</option>
            <option value="KM">Comores</option>
            <option value="CG">Congo</option>
            <option value="CD">Congo, República Democrática del</option>
            <option value="KR">Corea</option>
            <option value="KP">Corea del Norte</option>
            <option value="CI">Costa de Marfíl</option>
            <option value="CR">Costa Rica</option>
            <option value="HR">Croacia (Hrvatska)</option>
            <option value="CU">Cuba</option>
            <option value="DK">Dinamarca</option>
            <option value="DJ">Djibouti</option>
            <option value="DM">Dominica</option>
            <option value="EC">Ecuador</option>
            <option value="EG">Egipto</option>
            <option value="SV">El Salvador</option>
            <option value="AE">Emiratos Árabes Unidos</option>
            <option value="ER">Eritrea</option>
            <option value="SI">Eslovenia</option>
            <option value="ES" selected>
              España
            </option>
            <option value="US">Estados Unidos</option>
            <option value="EE">Estonia</option>
            <option value="ET">Etiopía</option>
            <option value="FJ">Fiji</option>
            <option value="PH">Filipinas</option>
            <option value="FI">Finlandia</option>
            <option value="FR">Francia</option>
            <option value="GA">Gabón</option>
            <option value="GM">Gambia</option>
            <option value="GE">Georgia</option>
            <option value="GH">Ghana</option>
            <option value="GI">Gibraltar</option>
            <option value="GD">Granada</option>
            <option value="GR">Grecia</option>
            <option value="GL">Groenlandia</option>
            <option value="GP">Guadalupe</option>
            <option value="GU">Guam</option>
            <option value="GT">Guatemala</option>
            <option value="GY">Guayana</option>
            <option value="GF">Guayana Francesa</option>
            <option value="GN">Guinea</option>
            <option value="GQ">Guinea Ecuatorial</option>
            <option value="GW">Guinea-Bissau</option>
            <option value="HT">Haití</option>
            <option value="HN">Honduras</option>
            <option value="HU">Hungría</option>
            <option value="IN">India</option>
            <option value="ID">Indonesia</option>
            <option value="IQ">Irak</option>
            <option value="IR">Irán</option>
            <option value="IE">Irlanda</option>
            <option value="BV">Isla Bouvet</option>
            <option value="CX">Isla de Christmas</option>
            <option value="IS">Islandia</option>
            <option value="KY">Islas Caimán</option>
            <option value="CK">Islas Cook</option>
            <option value="CC">Islas de Cocos o Keeling</option>
            <option value="FO">Islas Faroe</option>
            <option value="HM">Islas Heard y McDonald</option>
            <option value="FK">Islas Malvinas</option>
            <option value="MP">Islas Marianas del Norte</option>
            <option value="MH">Islas Marshall</option>
            <option value="UM">Islas menores de Estados Unidos</option>
            <option value="PW">Islas Palau</option>
            <option value="SB">Islas Salomón</option>
            <option value="SJ">Islas Svalbard y Jan Mayen</option>
            <option value="TK">Islas Tokelau</option>
            <option value="TC">Islas Turks y Caicos</option>
            <option value="VI">Islas Vírgenes (EEUU)</option>
            <option value="VG">Islas Vírgenes (Reino Unido)</option>
            <option value="WF">Islas Wallis y Futuna</option>
            <option value="IL">Israel</option>
            <option value="IT">Italia</option>
            <option value="JM">Jamaica</option>
            <option value="JP">Japón</option>
            <option value="JO">Jordania</option>
            <option value="KZ">Kazajistán</option>
            <option value="KE">Kenia</option>
            <option value="KG">Kirguizistán</option>
            <option value="KI">Kiribati</option>
            <option value="KW">Kuwait</option>
            <option value="LA">Laos</option>
            <option value="LS">Lesotho</option>
            <option value="LV">Letonia</option>
            <option value="LB">Líbano</option>
            <option value="LR">Liberia</option>
            <option value="LY">Libia</option>
            <option value="LI">Liechtenstein</option>
            <option value="LT">Lituania</option>
            <option value="LU">Luxemburgo</option>
            <option value="MK">Macedonia, Ex-República Yugoslava de</option>
            <option value="MG">Madagascar</option>
            <option value="MY">Malasia</option>
            <option value="MW">Malawi</option>
            <option value="MV">Maldivas</option>
            <option value="ML">Malí</option>
            <option value="MT">Malta</option>
            <option value="MA">Marruecos</option>
            <option value="MQ">Martinica</option>
            <option value="MU">Mauricio</option>
            <option value="MR">Mauritania</option>
            <option value="YT">Mayotte</option>
            <option value="MX">México</option>
            <option value="FM">Micronesia</option>
            <option value="MD">Moldavia</option>
            <option value="MC">Mónaco</option>
            <option value="MN">Mongolia</option>
            <option value="MS">Montserrat</option>
            <option value="MZ">Mozambique</option>
            <option value="NA">Namibia</option>
            <option value="NR">Nauru</option>
            <option value="NP">Nepal</option>
            <option value="NI">Nicaragua</option>
            <option value="NE">Níger</option>
            <option value="NG">Nigeria</option>
            <option value="NU">Niue</option>
            <option value="NF">Norfolk</option>
            <option value="NO">Noruega</option>
            <option value="NC">Nueva Caledonia</option>
            <option value="NZ">Nueva Zelanda</option>
            <option value="OM">Omán</option>
            <option value="NL">Países Bajos</option>
            <option value="PA">Panamá</option>
            <option value="PG">Papúa Nueva Guinea</option>
            <option value="PK">Paquistán</option>
            <option value="PY">Paraguay</option>
            <option value="PE">Perú</option>
            <option value="PN">Pitcairn</option>
            <option value="PF">Polinesia Francesa</option>
            <option value="PL">Polonia</option>
            <option value="PT">Portugal</option>
            <option value="PR">Puerto Rico</option>
            <option value="QA">Qatar</option>
            <option value="UK">Reino Unido</option>
            <option value="CF">República Centroafricana</option>
            <option value="CZ">República Checa</option>
            <option value="ZA">República de Sudáfrica</option>
            <option value="DO">República Dominicana</option>
            <option value="SK">República Eslovaca</option>
            <option value="RE">Reunión</option>
            <option value="RW">Ruanda</option>
            <option value="RO">Rumania</option>
            <option value="RU">Rusia</option>
            <option value="EH">Sahara Occidental</option>
            <option value="KN">Saint Kitts y Nevis</option>
            <option value="WS">Samoa</option>
            <option value="AS">Samoa Americana</option>
            <option value="SM">San Marino</option>
            <option value="VC">San Vicente y Granadinas</option>
            <option value="SH">Santa Helena</option>
            <option value="LC">Santa Lucía</option>
            <option value="ST">Santo Tomé y Príncipe</option>
            <option value="SN">Senegal</option>
            <option value="SC">Seychelles</option>
            <option value="SL">Sierra Leona</option>
            <option value="SG">Singapur</option>
            <option value="SY">Siria</option>
            <option value="SO">Somalia</option>
            <option value="LK">Sri Lanka</option>
            <option value="PM">St Pierre y Miquelon</option>
            <option value="SZ">Suazilandia</option>
            <option value="SD">Sudán</option>
            <option value="SE">Suecia</option>
            <option value="CH">Suiza</option>
            <option value="SR">Surinam</option>
            <option value="TH">Tailandia</option>
            <option value="TW">Taiwán</option>
            <option value="TZ">Tanzania</option>
            <option value="TJ">Tayikistán</option>
            <option value="TF">Territorios franceses del Sur</option>
            <option value="TP">Timor Oriental</option>
            <option value="TG">Togo</option>
            <option value="TO">Tonga</option>
            <option value="TT">Trinidad y Tobago</option>
            <option value="TN">Túnez</option>
            <option value="TM">Turkmenistán</option>
            <option value="TR">Turquía</option>
            <option value="TV">Tuvalu</option>
            <option value="UA">Ucrania</option>
            <option value="UG">Uganda</option>
            <option value="UY">Uruguay</option>
            <option value="UZ">Uzbekistán</option>
            <option value="VU">Vanuatu</option>
            <option value="VE">Venezuela</option>
            <option value="VN">Vietnam</option>
            <option value="YE">Yemen</option>
            <option value="YU">Yugoslavia</option>
            <option value="ZM">Zambia</option>
            <option value="ZW">Zimbabue</option>
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
              <h1 className="text-red-600 text-sm">{errors?.ciudad.message}</h1>
            )}
          </div>
          <div>
            <FormLabel>Población</FormLabel>
            <Input
              type="text"
              borderColor="blue.200"
              {...register("poblacion")}
              onClick={(e) => console.log(e)}
            />
            {!errors?.poblacion ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">
                {errors?.poblacion.message}
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
              <h1 className="text-red-600 text-sm">{errors?.via.message}</h1>
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
              <h1 className="text-red-600 text-sm">{errors?.calle.message}</h1>
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
              <h1 className="text-red-600 text-sm">{errors?.num.message}</h1>
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
              <h1 className="text-red-600 text-sm">{errors?.cp.message}</h1>
            )}
          </div>
          <div>
            <FormLabel optionalIndicator>Portal</FormLabel>
            <Input type="text" borderColor="blue.200" {...register("portal")} />
            {!errors?.portal ? (
              ""
            ) : (
              <h1 className="text-red-600 text-sm">{errors?.portal.message}</h1>
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
              <h1 className="text-red-600 text-sm">{errors?.terminos.message}</h1>
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
