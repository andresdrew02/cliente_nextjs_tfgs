import { API_URL } from "@/lib/api"
import { Box, Heading, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export default function ListaPedidos({ jwt }: { jwt: string }) {
    const [pedidos, setPedidos] = useState<any[]>([])
    const fetchPedidos = async () => {
        const pedidos = await (await fetch(`${API_URL}/pedidos`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })).json()
        setPedidos(pedidos.data)
    }
    useEffect(() => {
        fetchPedidos()
    }, [])
    return (
        <>
            {!pedidos || pedidos.length <= 0 && <Heading fontSize='2xl'>¡No has realizado ningún pedido aún, anímate y descubre arte!</Heading>}
            {pedidos && pedidos.length >= 1 && (
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Resumen de la oferta comprada</Th>
                            <Th>Precio del pedido</Th>
                            <Th>Cantidad final</Th>
                            <Th>Email</Th>
                            <Th>Nombre</Th>
                            <Th>Dirección</Th>
                            <Th>Estado</Th>
                            <Th>Fecha del pedido</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {pedidos.map((pedido) => (
                            <Tr key={pedido.id}>
                                <Td>{pedido.attributes.nombre_oferta.slice(0, -3)}</Td>
                                <Td>{pedido.attributes.precio_final}€</Td>
                                <Td>{pedido.attributes.cantidad_final}</Td>
                                <Td>{pedido.attributes.email_facturacion}</Td>
                                <Td>{pedido.attributes.nombre_facturacion}</Td>
                                <Td>
                                    <Box display='flex' flexDir={'column'} gap={4}>
                                        <Text>Calle: {pedido.attributes.direccion[0].calle.replace("null","")}</Text>
                                        <Text>Número: {pedido.attributes.direccion[0].numero.replace("null","")}</Text>
                                        <Text>Ciudad: {pedido.attributes.direccion[0].ciudad.replace("null","")}</Text>
                                        <Text>Código postal: {pedido.attributes.direccion[0].cp}</Text>
                                        <Text>Pais: {pedido.attributes.direccion[0].pais.replace("null","")}</Text>
                                        <Text>Población: {pedido.attributes.direccion[0].poblacion.replace("null","")}</Text>
                                    </Box>
                                </Td>
                                <Td>{pedido.attributes.estado}</Td>
                                <Td>{new Date(Date.parse(pedido.attributes.createdAt)).toLocaleString('en-ES')}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </>
    )
}