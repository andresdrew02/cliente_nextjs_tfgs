import { FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function CrearTiendaForm({ cb, loading }: { cb: Function, loading: boolean }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (data: any) => {
        await cb(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <FormControl isRequired>
                    <FormLabel>Nombre de la tienda</FormLabel>
                    <Input placeholder='Tienda de Fulanito...' {...register("nombre", {
                        required: 'Para crear una tienda, necesitas establecer un nombre de la tienda'
                    })} />
                    {errors.nombre && <span>{errors.nombre.message?.toString()}</span>}
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea placeholder='Esta tienda trata sobre...' {...register("descripcion", {
                        required: 'Para crear una tienda, necesitas establecer una descripción de la misma'
                    })} />
                    {errors.descripcion && <span>{errors.descripcion.message?.toString()}</span>}
                </FormControl>
                <FormControl>
                    <FormLabel>Dirección de correo</FormLabel>
                    <Input placeholder='correo@crearte.com' {...register("email")} />
                    
                </FormControl>
                <FormControl>
                    <FormLabel>Número de teléfono</FormLabel>
                    <Input placeholder='+34123456789' {...register("telefono", {
                        pattern:{
                            value: /^\+?\d{1,3}[-.\s]?\(?\d{1,}\)?[-.\s]?\d{1,}[-.\s]?\d{1,}[-.\s]?\d{1,}$/,
                            message: 'Número de teléfono no válido'
                        }
                    })} />
                    {errors.telefono && <span>{errors.telefono.message?.toString()}</span>}
                </FormControl>
            </div>
            <div className="modal-action flex justify-evenly">
                <label htmlFor="crearTiendaModal" className="btn btn-error">Cancelar</label>
                <input type='submit' className="btn btn-outline" disabled={loading} value={loading ? 'Creando...' : 'Crear tienda'} />
            </div>
        </form>
    )
}