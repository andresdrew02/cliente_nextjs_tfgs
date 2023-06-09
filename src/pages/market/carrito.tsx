import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter"
import { getServerSideProps } from "./[id]"
import Usuario from "@/interfaces/Usuario"
import { Box, Button, Divider, Flex, Heading, Image, Stack, Text, useToast } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { CartItems, deleteFromLocalCart, getLocalCart } from "@/lib/Cart"
import { API_URL, checkOut } from "@/lib/api"
import { FaTrash } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Carrito({ user, jwt }: { user: Usuario, jwt: string }) {
    const [cart, setCart] = useState<CartItems | null | undefined>()
    const [ofertas, setOfertas] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)
    const toast = useToast()
    const router = useRouter()
    const firstRender = useRef(true)

    const getOfertas = async () => {
        const cart = getLocalCart()
        setCart(cart)
        if (cart && cart.items.length > 0) {
            cart.items.map(async e => {
                const oferta = await (await fetch(`${API_URL}/ofertas/${e.id}?populate=fotos`)).json()
                setOfertas(oldArray => [...oldArray, {
                    oferta: oferta,
                    cantidad: e.cantidad,
                    uid: e.uid
                }])
                setTotal(total => parseFloat((total + oferta.data.attributes.precio_oferta * e.cantidad).toFixed(2)))
            })
        }
    }

    const borrarOferta = (id: string) => {
        setOfertas([])
        setTotal(0)
        deleteFromLocalCart(id)
        const badgeDom = document.getElementById("badge-carrito")
        if (badgeDom !== null) {
            const cart = getLocalCart()
            badgeDom.textContent = !cart ? "0" : cart.items.length.toString()
        }
        getOfertas()
    }

    const pagarHandler = async () => {
        if (user === null) {
            router.push('/auth-portal')
        }
        if (total < 5) {
            toast({
                title: 'El pago mínimo a realizar debe de ser de almenos 5€',
                status: 'error',
                isClosable: true,
                duration: 2500
            })
            return
        }
        await checkOut(ofertas, jwt, (response: any) => {
            if (!response) {
                toast({
                    title: 'Ha ocurrido un error inesperado al intentar redireccionarte al pago',
                    status: 'error',
                    isClosable: true,
                    duration: 2500
                })
            } else if (response.error) {
                if (response.error) {
                    toast({
                        title: response.error.message,
                        status: 'error',
                        isClosable: true,
                        duration: 2500
                    })
                }
            }
            if (response.paymentUrl) {
                toast({
                    title: 'Redireccionando al pago...',
                    status: 'loading',
                    isClosable: false,
                    duration: 9000
                })
                router.push(response.paymentUrl)
            } else {
                toast({
                    title: 'Ha ocurrido un error inesperado al intentar redireccionarte al pago',
                    status: 'error',
                    isClosable: true,
                    duration: 2500
                })
            }
        })
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        setOfertas([])
        getOfertas()
    }, [])
    return (
        <PlantillaNavFooter user={user}>
            <Flex w='full' p={5} gap={10} flexDir={['column','column','row']}>
                <Box boxShadow='md' w={['100%','100%','75%']} p={4}>
                    <Stack>
                        <Heading>Productos</Heading>
                    </Stack>
                    <Stack mt={10}>
                        {ofertas && ofertas.length > 0 &&
                            <Stack>
                                {ofertas.map(e => (
                                    <>
                                        <Box bg="white" rounded="md" p={4} key={e.oferta.data.attributes.id}>
                                            <Flex align="center" mb={4}>
                                                <Image src={`http://localhost:1337${e.oferta.data.attributes.fotos.data[0].attributes.url}`} alt={e.oferta.data.attributes.nombre} boxSize={50} objectFit="cover" mr={4} />
                                                <Box>
                                                    <Link href={`/market/${e.oferta.data.id}`}>
                                                        <Text fontSize={["md","lg","xl"]} fontWeight="bold" mb={1} _hover={{ textDecoration: 'underline' }} maxW={['10rem','20rem','30rem']}>
                                                            {e.oferta.data.attributes.nombre}
                                                        </Text>
                                                    </Link>
                                                </Box>
                                            </Flex>
                                            <Flex justify="space-between" align="center" flexDir={['column','row','row']}>
                                                <Box>
                                                    <Text fontWeight="bold" fontSize="xl">
                                                        Precio de la oferta: {e.oferta.data.attributes.precio_oferta}€
                                                    </Text>
                                                    <Text fontWeight="bold" fontSize="xl">
                                                        Cantidad: {e.cantidad}
                                                    </Text>
                                                </Box>
                                                <Button leftIcon={<FaTrash />} colorScheme="red" variant="outline" onClick={() => borrarOferta(e.uid)} w={['full','10rem']} mt={[4,0]}>
                                                    Eliminar
                                                </Button>
                                            </Flex>
                                        </Box>
                                        <Divider orientation='horizontal' />
                                    </>
                                ))}
                            </Stack>
                        }
                        {!cart || cart.items.length <= 0 && <Text>¡Agrega una oferta al carrito!</Text>}
                    </Stack>
                </Box>
                <Box w={['100%','100%','20%']} boxShadow='md' p={5}>
                    <Heading fontSize='2xl'>Realizar pago</Heading>
                    <Divider orientation="horizontal" mt={2} />
                    <Stack mt={4}>
                        <Text>Cantidad de ofertas: {ofertas.length}</Text>
                        <Text>Subtotal: {total}€</Text>
                        <Button colorScheme="green" isDisabled={!cart || cart.items.length <= 0} onClick={() => pagarHandler()}>Pagar</Button>
                    </Stack>
                </Box>
            </Flex>
        </PlantillaNavFooter>
    )
}

export { getServerSideProps }