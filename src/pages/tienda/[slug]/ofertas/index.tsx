import { useRouter } from "next/router";
import { getServerSideProps } from "../";
import Usuario from "@/interfaces/Usuario";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { ChangeEvent, useEffect, useState } from "react";
import { API_URL, deleteOferta } from "@/lib/api";
import { Box, Button, ButtonGroup, Center, Checkbox, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Image, Input, ListItem, Select, Spinner, Stack, Text, Textarea, UnorderedList, VStack, useToast } from "@chakra-ui/react";
import Link from "next/link";

export default function Ofertas({ user, jwt }: { user: Usuario | null, jwt: string }) {
    const router = useRouter()
    const [tienda, setTienda] = useState<Tienda>()
    const [loading, setLoading] = useState<boolean>(true)
    const [ofertas, setOfertas] = useState<any>([])
    const [page, setPage] = useState<number>(1)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [pageSize, setPageSize] = useState<string>("10")
    const { slug } = router.query
    const toast = useToast()

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

    const getOfertas = async () => {
        setLoading(true)
        const ofertas = await (await fetch(`${API_URL}/tienda/ofertas-tienda/${slug}?page=${page}&pageSize=${pageSize}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            }
        })).json()
        setOfertas(ofertas.data)
        if (ofertas.data.length < pageSize){
            setDisabled(true)
        }else{
            setDisabled(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        getTienda()
        getOfertas()
    }, [])

    useEffect(() => {
        if (page <= 0) {
            setPage(1)
        }else{
            getOfertas()
        }
    }, [page, pageSize])

    const deleteHandler = async (id: string,jwt:string,slug:string|string[]|undefined) => {
        const isOk = await deleteOferta(id,jwt,slug)
        if (isOk){
            toast({
                title: 'Oferta borrada con éxito',
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            setOfertas(ofertas.filter((e:any) => e.id !== id))
        }else{
            toast({
                title: 'Ha ocurrido un error al borrar la oferta..',
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
        }
    }

    return (
        <PlantillaNavFooter user={user}>
            <Center p={5}>
                <Heading>Ofertas de {tienda?.data.attributes.nombre}</Heading>
            </Center>
            <Flex justifyContent={'space-between'} w='full' p={4}>
                <Link href={`/tienda/${slug}/ofertas/crear-oferta`}><Button colorScheme="blue">Crear nueva oferta</Button></Link>
                <Flex flexDirection='column' gap={2}>
                    <Center>
                        <Stack>
                            <Text>Ofertas mostradas: {ofertas.length}</Text>
                            <Text>n. página: {page}</Text>
                        </Stack>
                    </Center>
                    <div className="btn-group grid grid-cols-2">
                        <button className="btn btn-outline" onClick={() => setPage(page - 1)}>Anterior</button>
                        <button className="btn btn-outline" onClick={() => setPage(page + 1)} disabled={disabled}>Siguiente</button>
                    </div>
                    <Select maxW='5rem' onChange={(e) => setPageSize(e.target.value)}>
                        <option value='5'>5</option>
                        <option value='10' selected>10</option>
                        <option value='15'>15</option>
                        <option value='20'>20</option>
                    </Select>
                </Flex>
            </Flex>
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
            <Grid w={"full"} templateColumns={["repeat(1,1fr)", "repeat(2,1fr)", "repeat(3,1fr)"]}>
                {ofertas?.length === 0 && <Center><Text>No tienes ninguna oferta</Text></Center>}
                {ofertas?.map((e: any) => (
                    <GridItem p={5}>
                        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                            <Image src={`http://localhost:1337${e.attributes.fotos.data[0].attributes.url}`} alt={e.nombre} />
                            <Box p="6">
                                <Box display="flex" alignItems="baseline">
                                    <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                                        {e.attributes.nombre}
                                    </Text>
                                    <Text ml="2" fontSize="sm" color="gray.500">
                                        Created at: {new Date(e.attributes.createdAt).toLocaleString()}
                                    </Text>
                                </Box>
                                <Text mt="2" fontSize="md" color="gray.600">
                                    {e.attributes.descripcion}
                                </Text>
                                <Text mt="2" fontSize="lg" fontWeight="bold" color="purple.500">
                                    Precio oferta: {e.attributes.precio_oferta}
                                </Text>
                                <Text mt="2" fontSize="lg" fontWeight="bold" color="purple.500">
                                    Stock: {e.attributes.stock}
                                </Text>
                                {e.attributes.productos.data.length > 0 && (
                                    <div>
                                        <Text mt="2" fontSize="md" color="gray.600">
                                            Productos:
                                        </Text>
                                        <UnorderedList mt="2">
                                            {e.attributes.productos.data.map((producto: any) => (
                                                <ListItem key={producto.id}>{producto.attributes.nombre}</ListItem>
                                            ))}
                                        </UnorderedList>
                                    </div>
                                )}
                                <Text mt="2" fontSize="md" color="gray.600">
                                    Tienda: {e.attributes.tienda.data.attributes.nombre}
                                </Text>
                                <ButtonGroup p={2}>
                                    <Link href={`/tienda/${slug}/ofertas/${e.id}/editar`}><Button colorScheme="yellow">Editar oferta</Button></Link>
                                    <Button colorScheme="red" onClick={() => deleteHandler(e.id,jwt,slug)}>Borrar oferta</Button>
                                </ButtonGroup>
                            </Box>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </PlantillaNavFooter >
    )
}
export { getServerSideProps }