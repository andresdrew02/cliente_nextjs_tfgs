import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getServerSideProps } from "../market";
import Usuario from "@/interfaces/Usuario";
import { GiConfirmed } from 'react-icons/gi'
import { useEffect } from "react";
import { deleteLocalCart } from "@/lib/Cart";

export default function Success({user}:{user:Usuario}) {
    const router = useRouter()
    const { msg } = router.query

    useEffect(() => {
        deleteLocalCart()
    },[])

    return (
        <PlantillaNavFooter user={user}>
            <Flex className="h-[80vh]" justifyContent='center' alignItems='center' flexDir='column' gap={4}>
                <Box flexDirection='row' display='flex' alignItems='center' gap={2}>
                    <Icon as={GiConfirmed} boxSize={10} color='green.600' />
                    <Text fontSize='xl' fontWeight='bold'>¡Se ha confirmado su pedido!</Text>
                </Box>
                <Text fontSize='md'>{msg}</Text>
            </Flex>
        </PlantillaNavFooter>
    )
}

export { getServerSideProps }