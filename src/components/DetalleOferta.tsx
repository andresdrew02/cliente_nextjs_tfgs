import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, CardBody, CardHeader, Flex, Grid, GridItem, Heading, Icon, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, Tooltip, useToast } from "@chakra-ui/react"
import Carousel from "./Carousel"
import Link from "next/link"
import { HiInformationCircle } from 'react-icons/hi'
import { useEffect, useState } from "react"
import { FaShoppingCart } from 'react-icons/fa'
import { addToCart } from "@/lib/Cart"

export default function DetalleOferta({ oferta }: { oferta: any }) {
    const [cantidad, setCantidad] = useState<number>(0)
    const toast = useToast()

    console.log(oferta)

    useEffect(() => {
        console.log(cantidad)
    }, [])

    const addToCartHandler = () => {
        //controlar que no añade un 0
        toast({
            title: "¡Agregado al carrito!",
            description: "Se ha agregado la oferta al carrito.",
            status: 'info',
            duration: 1000,
            isClosable: true
        })
        addToCart(oferta.id, cantidad)
    }

    return (
        <Stack p={10}>
            <Heading>{oferta.attributes.nombre}</Heading>
            <Grid templateColumns='repeat(2, 1fr)' gap={10}>
                <GridItem w='100%'>
                    <Box>
                        <Carousel fotos={oferta.attributes.fotos.data} />
                    </Box>
                </GridItem>
                <GridItem>
                    <Box display='flex' gap={10} flexDir='column'>
                        <Box>
                            <Heading fontSize='2xl'>Tienda vendedora</Heading>
                            <Link href={`/tienda/${oferta.attributes.tienda.data.attributes.slug}`}>
                                <Text _hover={{ textDecoration: 'underline' }}>{oferta.attributes.tienda.data.attributes.nombre}</Text>
                            </Link>
                        </Box>
                        <Box>
                            <Heading fontSize='2xl'>Descripcion</Heading>
                            <Text>{oferta.attributes.descripcion}</Text>
                        </Box>
                        <Box>
                            <Box display='flex' gap={4} alignItems='center'>
                                <Heading fontSize='2xl'>Cantidad disponible </Heading>
                                <div className="tooltip hover:cursor-help" data-tip="Esta cantidad significa la cantidad disponible de esta oferta como conjunto">
                                    <HiInformationCircle />
                                </div>
                            </Box>
                            <Text>{oferta.attributes.stock} unidades de esta oferta</Text>
                        </Box>
                        <Box>
                            <Heading fontSize='2xl'>Fecha de creación de la oferta</Heading>
                            <Text>{new Date(Date.parse(oferta.attributes.createdAt)).toLocaleDateString('es-ES')}</Text>
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
            <Stack display='flex' flexDir='column' gap={4}>
                <Box>
                    <Heading fontSize='2xl'>Precio de la oferta</Heading>
                    <Box display='flex' gap={4} alignItems='center'>
                        <Text fontSize='xl'>{oferta.attributes.precio_oferta}€ </Text>
                        <div className="tooltip hover:cursor-help tooltip-right" data-tip="Este precio es el precio por unidad de la oferta como conjunto">
                            <HiInformationCircle />
                        </div>
                    </Box>
                </Box>
                <Heading textDecor='underline'>Productos incluidos en esta oferta</Heading>
                <Accordion allowToggle>
                    {oferta.attributes.productos.data.map((e: any) => (
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Flex justifyContent='start' w='full' gap={4}>
                                        <Text>{e.attributes.nombre}</Text>
                                        <div className="badge">{e.attributes.categoria.data.attributes.titulo}</div>
                                    </Flex>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {e.attributes.descripcion}
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Stack>
            <Stack>
                <Stack spacing='4' mt={10}>
                    <Card variant='filled' maxW='50%'>
                        <CardHeader>
                            <Heading size='md'> Elegir cantidad</Heading>
                        </CardHeader>
                        <CardBody>
                            <NumberInput defaultValue={cantidad} min={0} max={oferta.attributes.stock}
                                onChange={(e) => setCantidad(parseInt(e))}>
                                <NumberInputField value={cantidad} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </CardBody>
                        <Box p={5} display='flex' gap={2}>
                            <Text>Total del pedido:</Text>
                            <Text>{cantidad * parseInt(oferta.attributes.precio_oferta)} €</Text>
                        </Box>
                        <Box p={4} w='full'>
                            <Button w='full' leftIcon={<FaShoppingCart/>} colorScheme="blue" onClick={addToCartHandler}>Agregar al carrito</Button>
                        </Box>
                    </Card>
                </Stack>
            </Stack>
        </Stack>
    )
}