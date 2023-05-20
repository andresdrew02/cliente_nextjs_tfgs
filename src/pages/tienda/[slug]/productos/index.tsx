import { useRouter } from "next/router";
import { getServerSideProps } from "../../../market";
import Usuario from "@/interfaces/Usuario";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { ChangeEvent, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { Button, ButtonGroup, Center, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { AiFillEdit } from 'react-icons/ai'
import EditProductoForm from "@/components/EditProductoForm";

export default function Productos({ user, jwt }: { user: Usuario | null, jwt: string }) {
    const router = useRouter()
    const [tienda, setTienda] = useState<Tienda>()
    const [loading, setLoading] = useState<boolean>(true)
    const [productos, setProductos] = useState<Producto[]>([])
    const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>([])
    const [productoEdicion, setProductoEdicion] = useState<Producto>()
    const { slug } = router.query

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

    const getProductos = async () => {
        const { data: productos } = await (await fetch(`${API_URL}/tienda/productos/${slug}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        })).json()
        setProductos(productos)
    }

    useEffect(() => {
        getTienda()
        getProductos()
    }, [])

    const seleccionar = (e: ChangeEvent<HTMLInputElement>, producto: Producto) => {
        if (e.target.checked) {
            setProductosSeleccionados(productos => [...productos, producto])
        } else {
            const filtrado = productosSeleccionados.filter(e => { return e.id !== producto.id })
            setProductosSeleccionados(filtrado)
        }
    }

    const borrar = async () => {
        if (productosSeleccionados.length === 0) {
            return
        }
        const res = await fetch(`${API_URL}/tienda/productos/deleteMany`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(productosSeleccionados)
        })
        if (res.ok){
            router.push(`/tienda/${tienda?.data.attributes.slug}/productos`)
        }
    }

    const editar = async (data: any) => {
        if (productoEdicion === undefined) {
            return
        }
        const res = await fetch(`/api/editarProducto`, {
            method: 'POST',
            body: JSON.stringify({
                data: data,
                idProducto: productoEdicion.id
            })
        })
        if (res.ok){
            router.push(`/tienda/${tienda?.data.attributes.slug}/productos`)
        }
    }

    return (
        <PlantillaNavFooter user={user}>
            {/*modal de edición*/}
            <input type="checkbox" id="editarModal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="editarModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">Editando producto: {productoEdicion?.attributes.nombre}</h3>
                    <div className="p-4">
                        <EditProductoForm producto={productoEdicion} cb={editar} />
                    </div>
                </div>
            </div>

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
            {!loading &&
                <Stack p={10} h='xl'>
                    <Heading>Gestionando productos de {tienda?.data.attributes.nombre}</Heading>
                    <Stack>
                        <ButtonGroup spacing='6'>
                            <Button colorScheme='green' onClick={() => router.push(`/tienda/${tienda?.data.attributes.slug}/productos/crear-producto`)}>Añadir un producto</Button>
                            <Button colorScheme='red' onClick={borrar} isDisabled={productosSeleccionados.length === 0}>Borrar seleccionados</Button>
                        </ButtonGroup>
                    </Stack>
                    {productos === null || productos.length === 0 && <h1>Todavía no existe ningún producto asignado a esta tienda</h1>}
                    {productos !== null && productos.length > 0 &&
                        <Stack p={4}>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Seleccionado</th>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Precio/u</th>
                                            <th>Categoría</th>
                                            <th>Fecha de creación</th>
                                            <th>Fecha de modificación</th>
                                            <th>Editar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((producto: Producto) => (
                                            <tr>
                                                <td className="flex justify-center">
                                                    <input type="checkbox" className="checkbox checkbox-error" onChange={(e) => seleccionar(e, producto)} />
                                                </td>
                                                <td>{producto.id}</td>
                                                <td>{producto.attributes.nombre}</td>
                                                <td>{producto.attributes.descripcion}</td>
                                                <td>{producto.attributes.precio_unidad}€</td>
                                                <td>{producto.attributes.categoria.data.attributes.titulo}</td>
                                                <td>{new Date(Date.parse(producto.attributes.createdAt)).toLocaleString('en-ES')}</td>
                                                <td>{new Date(Date.parse(producto.attributes.updatedAt)).toLocaleString('en-ES')}</td>
                                                <td>
                                                    <label htmlFor="editarModal" className="btn btn-sm btn-square btn-accent" onClick={() => setProductoEdicion(producto)}>
                                                        <AiFillEdit />
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Stack>
                    }
                </Stack >
            }
        </PlantillaNavFooter >
    )
}
export { getServerSideProps }