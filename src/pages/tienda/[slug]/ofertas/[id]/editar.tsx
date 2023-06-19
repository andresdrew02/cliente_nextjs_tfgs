import { useRouter } from "next/router";
import { getServerSideProps } from "..";
import Usuario from "@/interfaces/Usuario";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useForm } from "react-hook-form";
import { Box, Button, Center, Checkbox, FormControl, FormLabel, Heading, Image, Input, InputGroup, InputRightAddon, Select, Text, Textarea, VStack, useToast } from "@chakra-ui/react";

export default function CrearOferta({ user, jwt }: { user: Usuario | null, jwt: string }) {
    const router = useRouter()
    const toast = useToast()
    const [tienda, setTienda] = useState<Tienda>()
    const [loading, setLoading] = useState<boolean>(true)
    const [cantidad, setCantidad] = useState<number>(0)
    const [productos, setProductos] = useState<Producto[]>([])
    const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([])
    const [precio, setPrecio] = useState<string>('0')
    const [precioManual, setPrecioManual] = useState<boolean>(false)
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta>()
    const { slug, id } = router.query

    const { register, handleSubmit, formState } = useForm();
    const onSubmit = async (data: any) => {
        const formData = new FormData();
        for (let i = 0; i < data.fotos.length; i++) {
            formData.append('files.media', data.fotos[i])
        }
        formData.append('data', JSON.stringify({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            stock: data.stock,
            precioManual: data.precioManual,
            productos: data.productos,
            idTienda: tienda?.data.id
        }))

        const res = await fetch(`${API_URL}/ofertas/${id}`, {
            method: 'PUT',
            body: formData,
            headers: { Authorization: `Bearer ${jwt}` }
        })
        if (res.ok) {
            const oferta = await res.json()
            toast({
                title: 'Oferta editada con éxito',
                description: "Redireccionando...",
                status: 'info',
                duration: 2000,
                isClosable: false,
            })
            setTimeout(() => {
                router.push(`/market/${oferta.data.id}`)
            }, 500)
        } else {
            const err = await res.json()
            console.log(err)
            toast({
                title: 'Ha ocurrido un error al editar la oferta...',
                description: err.error.message,
                status: 'error',
                duration: 2000,
                isClosable: false,
            })
        }
    };

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

    const getOfertaSeleccionada = async () => {
        setLoading(true)
        const oferta = await(await fetch(`${API_URL}/ofertas/${id}?populate=productos`)).json()
        if (oferta !== null && oferta.error !== undefined && oferta.error.status === 404){
            router.push('/error/errorPage?msg=La%20oferta%20no%20existe')
        }
        setCantidad(oferta.data.attributes.stock)
        setOfertaSeleccionada(oferta.data)
        setLoading(false)
    }

    const getProductos = async () => {
        const { data: productos } = await (await fetch(`${API_URL}/tienda/productos/${slug}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        })).json()
        if (productos.length === 0) {
            router.push('/error/errorPage?msg=Para%20crear%20una%20oferta%20primero%20debes%20de%20tener%20productos%20asociados%20a%20tu%20tienda')
        }
        setProductos(productos)
    }

    useEffect(() => {
        getTienda()
        getProductos()
        getOfertaSeleccionada()
    }, [])

    useEffect(() => {
        if (Number.isNaN(precio)) {
            setPrecio('0')
        }
    }, [precio])

    useEffect(() => {
        if (Number.isNaN(cantidad)) {
            setCantidad(0)
        }
    }, [cantidad])

    useEffect(() => {
        if (precioManual) {
            setPrecio('0')
        } else {
            let suma = 0
            productosSeleccionados.map((e) => suma += e)
            setPrecio(parseFloat(suma.toString()).toString())
            setPrecio(parseFloat(suma.toString()).toString())
        }
    }, [precioManual])

    useEffect(() => {
        if (!precioManual) {
            setPrecio('0')
            productosSeleccionados.map((e) => setPrecio((parseFloat(precio) + e).toString()))
        }
    }, [productosSeleccionados])

    return (
        <PlantillaNavFooter user={user}>
            <div className="p-5">
                <Heading p={5}>
                    Editando {ofertaSeleccionada?.attributes.nombre}
                </Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                        <FormControl id="nombre" isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input {...register("nombre", { required: true })} defaultValue={ofertaSeleccionada?.attributes.nombre} />
                        </FormControl>
                        <FormControl id="stock" isRequired>
                            <FormLabel>Stock</FormLabel>
                            <Input value={cantidad} {...register("stock", { required: true, min: 1, pattern: /^[1-9]\d*$/ })} onChange={(e) => setCantidad(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormControl id="descripcion" isRequired>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea {...register("descripcion", { required: true })} defaultValue={ofertaSeleccionada?.attributes.descripcion}/>
                        </FormControl>
                        <FormControl id="precio" >
                            <Checkbox {...register("precio")} checked={precioManual} onChange={(e) => setPrecioManual(e.target.checked)}>¿Quieres establecer un precio manualmente? (Opcional)</Checkbox>
                        </FormControl>
                        {precioManual &&
                            <FormControl id="precioManual" >
                                <FormLabel>Precio de la oferta</FormLabel>
                                <InputGroup>
                                    <Input step="0.01" {...register("precioManual", { required: precioManual ? true : false, min: 1, pattern: /^(5|[6-9]\d*|\d+\.[0-9]{1,})\s?€?$/ })} maxW={"xs"} onChange={(e) => setPrecio(parseFloat(e.target.value).toString())} />
                                    <InputRightAddon children='€' />
                                </InputGroup>
                            </FormControl>
                        }
                        <FormControl id="fotos" isRequired>
                            <FormLabel>Fotos (mínimo una)</FormLabel>
                            <Input type="file" multiple {...register("fotos", { required: true })} />
                        </FormControl>
                        <FormControl id="producto">
                            <FormLabel>Elegir un producto de la tienda</FormLabel>
                            {productos.map(producto => (
                                <>
                                    <Checkbox value={producto.id} key={producto.id} {...register("productos")} onChange={(e) => {
                                        if (e.target.checked) {
                                            setProductosSeleccionados([...productosSeleccionados, producto.attributes.precio_unidad])
                                        } else {
                                            setProductosSeleccionados([...productosSeleccionados, -producto.attributes.precio_unidad])
                                        }
                                    }}>
                                        {producto.attributes.nombre} , {producto.attributes.categoria.data.attributes.titulo} , {producto.attributes.createdAt}
                                    </Checkbox>
                                    <br></br>
                                </>
                            ))}
                        </FormControl>
                        <Box p={4}>
                            <Text>Precio final de venta por unidad: {cantidad <= 0 ? 0 : parseFloat(precio).toFixed(2)}€</Text>
                            <Text>Precio total de venta: {(parseFloat(precio) * cantidad).toFixed(2)}€</Text>
                        </Box>
                        <Button type="submit" disabled={formState.isSubmitting} colorScheme="yellow">
                            Editar oferta
                        </Button>
                    </VStack>
                </form>
            </div>
        </PlantillaNavFooter >
    )
}
export { getServerSideProps }