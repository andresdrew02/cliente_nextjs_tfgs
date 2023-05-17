import {
    Box,
    Container,
    Stack,
    Text,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    List,
    ListItem,
    useToast,
    Center,
    Flex,
    ButtonGroup,
    Button,
} from '@chakra-ui/react';
import { AiFillMail, AiFillPhone } from 'react-icons/ai'
import { addToCart } from '@/lib/Cart';
import SpecificCard from './SpecificCard';
import { useRouter } from 'next/router';

export default function DetalleTienda({ tienda, ofertas, isEditable }: { tienda: Tienda | undefined, ofertas: [], isEditable: boolean }) {
    const toast = useToast()
    const router = useRouter()
    const addToCartHandler = (id: number, cantidad: number = 1) => {
        toast({
            title: "¡Agregado al carrito!",
            description: "Se ha agregado la oferta al carrito.",
            status: 'info',
            duration: 1000,
            isClosable: true
        })
        addToCart(id, cantidad)
    }

    return (
        <Container maxW={'7xl'}>
            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 18, md: 24 }}>
                <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={'header'}>
                        <Heading
                            lineHeight={1.1}
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                            {tienda?.data.attributes.nombre}
                        </Heading>
                    </Box>
                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                            />
                        }>
                        <Text fontSize={'lg'}>
                            {tienda?.data.attributes.descripcion}
                        </Text>
                        <Box>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                color={useColorModeValue('yellow.500', 'yellow.300')}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Dueño de la tienda
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                <List spacing={2}>
                                    <ListItem>@{tienda?.data.attributes.admin_tienda.data.attributes.username}</ListItem>
                                </List>
                            </SimpleGrid>
                        </Box>
                    </Stack>
                    {(tienda?.data.attributes.email !== null || tienda?.data.attributes.telefono !== null) &&
                        <Stack
                            spacing={{ base: 4, sm: 6 }}
                            direction={'column'}>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                color={useColorModeValue('yellow.500', 'yellow.300')}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Información de contacto
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                <List spacing={2}>
                                    {tienda?.data.attributes.email !== null && <Stack direction='row' alignItems='center'><AiFillMail/><Text>{tienda?.data.attributes.email}</Text></Stack>}
                                    {tienda?.data.attributes.telefono !== null && <Stack direction='row' alignItems='center'><AiFillPhone/><Text>{tienda?.data.attributes.telefono}</Text></Stack>}
                                </List>
                            </SimpleGrid>
                        </Stack>
                    }
                </Stack>
                {isEditable &&
                    <Flex justifyContent='right'>
                        <Stack>
                            <ButtonGroup variant='outline' spacing='6'>
                                <Button colorScheme='blue' onClick={() => router.push(`/tienda/${tienda?.data.attributes.slug}/productos`)}>Gestionar productos</Button>
                                <Button colorScheme='blue' onClick={() => router.push(`/tienda/${tienda?.data.attributes.slug}/ofertas`)}>Gestionar ofertas</Button>
                            </ButtonGroup>
                        </Stack>
                    </Flex>}
            </SimpleGrid>
            <Stack>
                <Center><Text fontSize='2xl'>Ofertas de {tienda?.data.attributes.nombre}</Text></Center>
                <SimpleGrid columns={[1, 1, 1, 2, 3]}
                    spacing={{ base: 8, md: 10 }}
                    py={{ base: 5, md: 10 }}>
                    {ofertas.length === 0 && <Text>Esta tienda todavía no tiene ninguna oferta disponible</Text>}
                    {ofertas.length !== 0 && ofertas.map((e) => <SpecificCard oferta={e} cartHandler={addToCartHandler} />)}
                </SimpleGrid>
            </Stack>
        </Container>
    );
}
