import { FormControl, FormLabel, Input, Textarea, Select, Button, useToast } from "@chakra-ui/react";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { useForm } from "react-hook-form";
import { getServerSideProps } from "..";
import Usuario from "@/interfaces/Usuario";
import { Center, Heading, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { API_URL, getAllCategorias } from "@/lib/api";

export default function crearProducto({ user }: { user: Usuario }) {
    const router = useRouter()
    const { slug } = router.query
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [categorias, setCategorias] = useState<any[]>([])
    const [tienda, setTienda] = useState<Tienda>()
    const [loading, setLoading] = useState<boolean>(true)
    const toast = useToast()

    const onSubmit = async (data: any) => {
        const res = await fetch('/api/crearProducto', {
            method: 'POST',
            body: JSON.stringify({
                data: data,
                idTienda: tienda?.data.id
            })
        })
        if (res.ok) {
            router.push(`/tienda/${tienda?.data.attributes.slug}/productos/`)
        } else {
            toast({
                title: 'Ha ocurrido un error al crear el producto',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    if (!slug) {
        router.push('/error/errorPage?msg=Para%20buscar%20una%20tienda,%20necesita%20poner%20el%20código%20del%20la%20tienda')
    }
    const getTienda = async () => {
        setLoading(true)
        const tienda = await (await fetch(`${API_URL}/tiendas/${slug}`)).json()
        if (tienda.data === null) {
            router.push('/error/errorPage?code=404&msg=No%20se%20ha%20encontrado%20la%20tienda')
            return
        }
        setTienda(tienda)
        if (tienda?.data.attributes.admin_tienda.data.id !== user?.data?.id) {
            router.push('/error/errorPage?code=403&msg=Acceso%20denegado')
        }
        setLoading(false)
    }

    const getCategorias = async () => {
        const categorias = await getAllCategorias()
        setCategorias(categorias.data)
    }

    useEffect(() => {
        getTienda()
        getCategorias()
    }, [])

    return (
        <PlantillaNavFooter user={user}>
            {!loading &&
                <div className="p-10">
                    <Heading textAlign='center'>Creando un producto para {tienda?.data.attributes.nombre}</Heading>
                    <div className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input type="text" {...register("nombre", { required: true, max: 50, minLength: 5, maxLength: 50 })} />
                                {errors.nombre && <span>Nombre es requerido y debe tener entre 5 y 50 caracteres</span>}
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea {...register("descripcion", {
                                    required: true, max: 500, minLength: 50, maxLength: 500, pattern: {
                                        value: /^[a-zA-Z0-9!@#$%^&ñÑ*()_+={[}\]|\\:;"'<,>.?/ -]{50,500}$/,
                                        message: 'La descripción solo puede tener mayusculas, minusculas, letras y símbolos. Además debe de tener entre 50 y 500 caracteres'
                                    }
                                })} />
                                {errors.descripcion && <span>Descripción es requerida y debe tener entre 50 y 500 caracteres</span>}
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Precio por Unidad</FormLabel>
                                <Input type="number" placeholder="Precio por unidad" {...register("ppu", {
                                    pattern: {
                                        value: /^\d+(\.\d+)?$/,
                                        message: 'El número debe de ser un número positivo'
                                    }
                                })} step='0.01' />
                            </FormControl>
                            {errors.ppu && <span>{errors.ppu.message?.toString()}</span>}
                            <FormControl isRequired mt={4}>
                                <FormLabel>Categoría</FormLabel>
                                <Select {...register("categoria", { required: true })}>
                                    {categorias.map((e: any) => (
                                        <option key={e.id} value={e.id}>{e.attributes.titulo}</option>
                                    ))}
                                </Select>
                                {errors.categoria && <span>Categoría es requerida</span>}
                            </FormControl>
                            <Button type="submit" mt={4} colorScheme="blue">Enviar</Button>
                        </form>
                    </div>
                </div>
            }
            {loading &&
                <Center p={10}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Center>
            }
        </PlantillaNavFooter>
    )
}

export { getServerSideProps }