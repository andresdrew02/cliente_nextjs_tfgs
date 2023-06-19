import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter"
import Usuario from "@/interfaces/Usuario"
import { useRouter } from "next/router"
import { getServerSideProps } from "../protected/profile"
import { useEffect, useState } from "react"
import { Box, Center, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react"
import { getOfertaPorId } from "@/lib/api"
import { BiErrorCircle } from 'react-icons/bi'
import Oferta from "@/components/DetalleOferta"
import DetalleOferta from "@/components/DetalleOferta"

export default function ViewOferta({ user }: { user: Usuario }) {
    type ofertaResponse = {
        success: boolean
        data?: Oferta
        errorMsg?: String
    }
    const [loading, setLoading] = useState<boolean>(true)
    const [oferta, setOferta] = useState<ofertaResponse>()
    const router = useRouter()
    const { id } = router.query


    const MostradoError = (
        <Flex className="h-[80vh]" justifyContent='center' alignItems='center' flexDir='column' gap={4}>
            <Box flexDirection='row' display='flex' alignItems='center' gap={2}>
                <Icon as={BiErrorCircle} boxSize={10} color='red.600'/>
                <Text fontSize='xl' fontWeight='bold'>Ha ocurrido un error.</Text>
            </Box>
            <Text fontSize='md'>{oferta?.errorMsg}</Text>
        </Flex>
    )

    const getOferta = async () => {
        setLoading(true)
        const oferta = await getOfertaPorId(id)
        setOferta(oferta)
        if (!oferta.success) {
            return MostradoError
        }
        setLoading(false)
    }

    useEffect(() => {
        getOferta()
    }, [])

    return (
        <PlantillaNavFooter user={user}>
            {loading && oferta === undefined ?
                <Center>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </Center>
                :
                (!oferta?.success || oferta.data === undefined) ? MostradoError
                    :
                    oferta?.success && <DetalleOferta oferta={oferta.data} />
            }
        </PlantillaNavFooter>
    )
}

export { getServerSideProps }