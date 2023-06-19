import { Button, Card, CardBody, CardFooter, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Textarea, useBoolean, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CrearTiendaForm from "./CrearTiendaForm";
import { API_URL } from "@/lib/api";
import { useForm } from "react-hook-form";
import { MdAddBusiness } from 'react-icons/md'
import Link from "next/link";
import { createSlug } from "@/utils/slug";

export default function MyShops({ jwt }: { jwt: string }) {
    //Todo, fetch tiendas
    const [tiendas, setTiendas] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState<any>({})
    const { register, handleSubmit, formState: { errors } } = useForm()
    const toast = useToast()
    const handleCrearTienda = async (data: any) => {
        setLoading(true)
        const { nombre, descripcion, telefono, email } = data
        const tiendaCreada = await fetch('/api/crearTienda', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    nombre: nombre,
                    descripcion: descripcion,
                    telefono: telefono,
                    email: email
                }
            })
        })
        if (tiendaCreada.ok) {
            const tienda = await tiendaCreada.json() //al final no voy a usar la tienda que devuelvo, debido a que Strapi, por algna razón la devuelve sin el ID y le necesito mas adelante
            await fetchMyTiendas()
            toast({
                title: 'Tienda creada.',
                description: 'Se ha creado la tienda satisfactoriamente',
                status: 'success',
                duration: 2000,
                isClosable: true
            })
        } else {
            if (tiendaCreada.status === 409) {
                toast({
                    title: 'Error al crear la tienda',
                    description: 'El nombre de esa tienda ya está en uso',
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                })
            } else {
                if (tiendaCreada.status === 422) {
                    toast({
                        title: 'Error al crear la tienda',
                        description: 'Solo puedes tener como máximo 3 tiendas.',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                } else {
                    toast({
                        title: 'Error al crear la tienda',
                        description: 'Ha ocurrido un error al crear la tienda',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                }
            }
        }
        setLoading(false)
    }

    const fetchMyTiendas = async () => {
        const tiendas = await fetch(`${API_URL}/tienda/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
        try {
            const arrTiendas = await tiendas.json()
            if (arrTiendas.data) {
                setTiendas([...arrTiendas.data])
            }
        }
        catch (ex) {
            toast({
                title: 'Error al ver tus tiendas',
                description: 'Ha ocurrido un error al ver tus tiendas, inténtelo de nuevo mas tarde',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }
    useEffect(() => {
        fetchMyTiendas()
    }, [])

    const borrarTienda = async (id: string) => {
        const response = await fetch(`${API_URL}/tiendas/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let actualizaTiendas = tiendas.filter((e) => { return e.id !== id })
            setTiendas([...actualizaTiendas])
            toast({
                title: 'Se ha borrado la tienda correctamente!',
                status: 'info',
                duration: 2000,
                isClosable: true
            })
        } else {
            toast({
                title: 'Ha ocurrido un error al borrar la tienda',
                description: 'Ha ocurrido un error inesperado al borrar la tienda',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    const seleccionar = (id: string) => {
        let tienda = tiendas.filter((e) => { return e.id === id })
        setTiendaSeleccionada(tienda[0])
    }

    const editar = async (data: any) => {
        const { nombre, descripcion, email, telefono } = data
        const res = await fetch('/api/editarTienda', {
            method: 'POST',
            body: JSON.stringify({
                id: tiendaSeleccionada.id,
                nombre: nombre,
                descripcion: descripcion,
                email: email,
                telefono: telefono
            })
        })
        if (res.ok) {
            toast({
                title: 'Se ha editado la tienda correctamente!',
                status: 'info',
                duration: 2000,
                isClosable: true
            })
            const objIndex = tiendas.findIndex((obj => obj.id === tiendaSeleccionada.id))
            tiendas[objIndex].attributes.descripcion = descripcion
            tiendas[objIndex].attributes.nombre = nombre
            tiendas[objIndex].attributes.slug = createSlug(nombre)
            setTiendas([...tiendas])
        } else {
            toast({
                title: 'Ha ocurrido un error al editar la tienda',
                description: 'Ha ocurrido un error inesperado al editar la tienda',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    return (
        <Stack p={4} minH='2xs'>
            <Flex justifyContent='right' title={tiendas.length >= 3 ? 'Solo puedes tener un máximo de tres tiendas' : '¡Crea una tienda!'}>
                <label htmlFor="crearTiendaModal" className={tiendas.length >= 3 ? "btn btn-disabled disabled text-3xl" : 'btn text-3xl'}><MdAddBusiness/></label>
            </Flex>
            <Flex>
                {/*Modals...*/}
                <input type="checkbox" id="crearTiendaModal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Crear una tienda</h3>
                        <div className="p-5">
                            <CrearTiendaForm cb={handleCrearTienda} loading={loading} />
                        </div>
                    </div>
                </div>
                <input type="checkbox" id="editarTiendaModal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Editando {tiendaSeleccionada?.attributes?.nombre}</h3>
                        <form onSubmit={handleSubmit(editar)}>
                            <div className="p-5">
                                <FormControl isRequired>
                                    <FormLabel>Nombre de la tienda</FormLabel>
                                    <Input placeholder='Tienda de Fulanito...' defaultValue={tiendaSeleccionada?.attributes?.nombre} {...register("nombre", {
                                        required: 'Para crear una tienda, necesitas establecer un nombre de la tienda'
                                    })} />
                                    {errors.nombre && <span>{errors.nombre.message?.toString()}</span>}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Descripción</FormLabel>
                                    <Textarea placeholder='Esta tienda trata sobre...' defaultValue={tiendaSeleccionada?.attributes?.descripcion} {...register("descripcion", {
                                        required: 'Para crear una tienda, necesitas establecer una descripción de la misma'
                                    })} />
                                    {errors.descripcion && <span>{errors.descripcion.message?.toString()}</span>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Dirección de correo</FormLabel>
                                    <Input placeholder='correo@crearte.com' defaultValue={tiendaSeleccionada?.attributes?.email} {...register("email")} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Número de teléfono</FormLabel>
                                    <Input placeholder='+34123456789' defaultValue={tiendaSeleccionada?.attributes?.telefono} {...register("telefono", {
                                        pattern: {
                                            value: /^\+?\d{1,3}[-.\s]?\(?\d{1,}\)?[-.\s]?\d{1,}[-.\s]?\d{1,}[-.\s]?\d{1,}$/,
                                            message: 'Número de teléfono no válido'
                                        }
                                    })} />
                                    {errors.telefono && <span>{errors.telefono.message?.toString()}</span>}
                                </FormControl>
                                <div>
                                    <label htmlFor="editarTiendaModal" className="btn btn-error mt-4">Cancelar</label>
                                    <input type="submit" className="btn ml-4" value='Confirmar cambios' />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {tiendas.length === 0 && <h1>No tienes ninguna tienda creada, ¡crea tu primera tienda!</h1>}
                {tiendas.length !== 0 &&
                    <div className="w-full flex flex-col gap-4 p-4">
                        {tiendas.map(e => (
                            <Card
                                direction='column'
                                overflow='hidden'
                                variant='outline'
                                minW='full'
                                key={e.id}
                            >
                                <Stack>
                                    <CardBody>
                                        <Heading size='md'><Link className="hover:underline" href={`/tienda/${e.attributes.slug}`}>{e.attributes.nombre}</Link></Heading>
                                        <Text py='2'>
                                            {e.attributes.descripcion}
                                        </Text>
                                    </CardBody>
                                    <CardFooter gap='4'>
                                        <Button variant='ghost' colorScheme='blue'>
                                            <Link className="hover:underline" href={`/tienda/${e.attributes.slug}`}>Añadir productos / crear ofertas</Link>
                                        </Button>
                                        <Button variant='ghost' colorScheme='yellow' onClick={() => seleccionar(e.id)}>
                                            <label htmlFor="editarTiendaModal">Editar tienda</label>
                                        </Button>
                                        <Button variant='solid' colorScheme='red' onClick={() => window.confirm(`¿Desea borrar la tienda ${e.attributes.nombre}?`) && borrarTienda(e.id)}>
                                            Borrar tienda
                                        </Button>
                                    </CardFooter>
                                </Stack>
                            </Card>
                        ))}
                    </div>
                }
            </Flex>
        </Stack>
    )
}