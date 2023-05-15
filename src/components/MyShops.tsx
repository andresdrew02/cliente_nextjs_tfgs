import { Button, Card, CardBody, CardFooter, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useBoolean, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CrearTiendaForm from "./CrearTiendaForm";
import { API_URL } from "@/lib/api";
import { useForm } from "react-hook-form";

export default function MyShops({ jwt }: { jwt: string }) {
    //Todo, fetch tiendas
    const [tiendas, setTiendas] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState<any>({})
    const { register, handleSubmit, formState: { errors } } = useForm()
    const toast = useToast()
    const handleCrearTienda = async (data: any) => {
        setLoading(true)
        const { nombre, descripcion } = data
        const tiendaCreada = await fetch('/api/crearTienda', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    nombre: nombre,
                    descripcion: descripcion
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
        console.log(jwt)
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
        const { nombre, descripcion } = data
        const res = await fetch('/api/editarTienda', {
            method: 'POST',
            body: JSON.stringify({
                id: tiendaSeleccionada.id,
                nombre: nombre,
                descripcion: descripcion
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
            setTiendas([...tiendas])
        }else{
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
            <Flex justifyContent='right'>
                <label htmlFor="crearTiendaModal" className="btn">Crear tienda</label>
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
                                    <Input placeholder='Esta tienda trata sobre...' defaultValue={tiendaSeleccionada?.attributes?.descripcion} {...register("descripcion", {
                                        required: 'Para crear una tienda, necesitas establecer una descripción de la misma'
                                    })} />
                                    {errors.descripcion && <span>{errors.descripcion.message?.toString()}</span>}
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
                            >
                                <Stack>
                                    <CardBody>
                                        <Heading size='md'>{e.attributes.nombre}</Heading>
                                        <Text py='2'>
                                            {e.attributes.descripcion}
                                        </Text>
                                    </CardBody>
                                    <CardFooter gap='4'>
                                        <Button variant='ghost' colorScheme='blue'>
                                            Añadir productos u ofertas
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