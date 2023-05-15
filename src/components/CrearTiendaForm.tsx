import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function CrearTiendaForm({ cb, loading }: { cb: Function,loading:boolean }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (data: any) => {
        await cb(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired>
                <FormLabel>Nombre de la tienda</FormLabel>
                <Input placeholder='Tienda de Fulanito...' {...register("nombre", {
                    required: 'Para crear una tienda, necesitas establecer un nombre de la tienda'
                })} />
                {errors.nombre && <span>{errors.nombre.message?.toString()}</span>}
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Descripción</FormLabel>
                <Input placeholder='Esta tienda trata sobre...' {...register("descripcion", {
                    required: 'Para crear una tienda, necesitas establecer una descripción de la misma'
                })} />
                {errors.descripcion && <span>{errors.descripcion.message?.toString()}</span>}
            </FormControl>
            <div className="modal-action flex justify-evenly">
                <label htmlFor="crearTiendaModal" className="btn btn-error">Cancelar</label>
                <input type='submit' className="btn btn-outline" disabled={loading} value={loading ? 'Creando...' : 'Crear tienda'}/>
            </div>
        </form>
    )
}