import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react'
import { getAllCategorias } from "@/lib/api";
import { AiFillInfoCircle } from "react-icons/ai";

export default function EditProductoForm({ producto, cb }: { producto: Producto | undefined, cb: Function }) {
    if (producto === undefined) {
        return (
            <h1>Ha ocurrido un error al cargar el formulario, inténtelo de nuevo</h1>
        )
    }
    const [categorias, setCategorias] = useState<any[]>([])
    const fetchAllCategorias = async () => {
        const { data: categorias } = await getAllCategorias()
        setCategorias(categorias)
    }

    useEffect(() => {
        fetchAllCategorias()
    }, [])
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: any) => cb(data);

    //Formulario
    return (
        <div className="form-control w-full max-w-s">
            <div className="text-error">
                {errors.nombre && <p>{errors.nombre?.message?.toString()}</p>}
                {errors.descripcion && <p>{errors.descripcion?.message?.toString()}</p>}
                {errors.categoria && <p>{errors.categoria?.message?.toString()}</p>}
                {errors.ppu && <p>{errors.ppu?.message?.toString()}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="label">
                    <span className="label-text">Nombre del producto <span className="text-error">*</span></span>
                </label>
                <input defaultValue={producto.attributes.nombre} type="text" className="input input-bordered w-full" placeholder="Nombre del producto" {...register("nombre", {
                    required: "El nombre es obligatorio", maxLength: {
                        value: 100,
                        message: 'El nombre puede tener como máximo 100 caracteres de longitud'
                    },
                    pattern: {
                        value: /^[A-Za-z\s]{10,100}$/,
                        message: 'El nombre del producto solo puede contener letras y debe de estar situado entre 10 y 100 caracteres.'
                    }
                })} />
                <label className="label">
                    <span className="label-text">Descripción del producto <span className="text-error">*</span></span>
                </label>
                <textarea defaultValue={producto.attributes.descripcion} className="input p-4 input-bordered w-full" {...register("descripcion", {
                    required: "La descripción es obligatoria", minLength: {
                        value: 50,
                        message: 'La descripción debe de tener mínimo 50 caracteres'
                    }, maxLength: {
                        value: 200,
                        message: 'La descripción como máximo puede tener 200 caracteres de longitud'
                    },
                    pattern:{
                        value: /^[a-zA-Z0-9!@#$%^&*()_+={[}\]|\\:;"'<,>.?/ -]{50,200}$/,
                        message: 'La descripción solo puede tener mayusculas, minusculas, letras y simbolos.'
                    }
                })} placeholder="Descripción del producto" />
                <label className="label">
                    <span className="label-text">Categoría <span className="text-error">*</span></span>
                </label>
                <select {...register("categoria", { required: 'Debes de elegir una categoría' })} className="input input-bordered max-w-xs">
                    {categorias.map(e => (
                        <option value={e.id}>{e.attributes.titulo}</option>
                    ))}
                </select>
                <div className="flex gap-1 items-center">
                    <label className="label">
                        <span className="label-text">Precio por unidad €</span>
                    </label>
                    <div className="tooltip tooltip-primary hover:cursor-pointer text-xl" data-tip="Puede establecer un precio por unidad, o si lo prefiere, definirlo a la hora de crear una oferta.">
                        <AiFillInfoCircle/>
                    </div>
                </div>
                <input defaultValue={producto.attributes.precio_unidad} type="number" placeholder="Precio por unidad" className="input input-bordered w-sm max-w-sm" {...register("ppu", {})} />
                <label className="label">
                    <input type="submit" className="btn w-full mt-4" value='Confirmar cambios' />
                </label>
            </form>
        </div>
    );
}