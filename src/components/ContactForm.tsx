import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { postContactForm } from '../lib/api'
import Success from '../components/Success'
import Error from '../components/Error'

export default function ContactForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(false)
    setSuccess(false)

    const body = {
      usuario_contacto: data.email,
      motivo: data.title,
      detalle: data.detalle,
      definicion: 'ayuda'
    }
    const response = await postContactForm(body)
    response ? setSuccess(true) : setError(true)
    setLoading(false)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors === null}>
        <div>
          {error && <Error msg="Ha ocurrido un error al enviar el formulario, inténtelo de nuevo mas tarde."/>}
          {success && <Success msg="Formulario enviado correctamente, nos pondremos en contacto contigo lo mas pronto posible"/>}
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
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
        <div className="mt-4">
          <FormLabel>Motivo breve de la petición de contacto</FormLabel>
          <Input
            type="text"
            {...register("title", {
              required: "Debe de resumir brevemente el motivo del contacto.",
            })}
          />
          {errors?.title && (
            <h1 className="text-red-600 text-sm">{errors?.title.message}</h1>   
          )}
        </div>
        <div className="mt-4">
          <FormLabel>Detalle su motivo del contacto</FormLabel>
          <Textarea
            {...register("detalle", {
              required: "Debe de detallar el motivo del contacto.",
            })}
          />
          {errors?.detalle && (
            <h1 className="text-red-600 text-sm">{errors?.detalle.message}</h1>   
          )}
        </div>
        <Button
          isLoading={loading}
          className="mt-4"
          type="submit"
          colorScheme="blue"
        >
          🚀 Enviar
        </Button>
      </FormControl>
    </form>
  );
}