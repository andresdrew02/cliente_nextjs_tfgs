import { Badge, Box, Button, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, Stack, Text, useBoolean } from "@chakra-ui/react";
import { useForm } from 'react-hook-form'
import { GrFormView, GrFormViewHide } from 'react-icons/gr'
import Error from './Error'
import { useState } from 'react'
import Usuario from "@/interfaces/Usuario";
import Success from "./Success";

export default function SecurityForms({ user }: { user: Usuario }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [verActual, setVerActual] = useBoolean()
    const [verPwd1, setVerPwd1] = useBoolean()
    const [verPwd2, setVerPwd2] = useBoolean()
    const [loading, setLoading] = useBoolean()
    const [errorMsg, setErrorMsg] = useState<string[]>([])
    const [success, setSuccess] = useBoolean()

    const onSubmit = async (data: any) => {
        setErrorMsg([])
        setSuccess.off()
        setLoading.off()
        setLoading.on()

        const { actual, pw1, pw2 } = data
        if (pw1 !== pw2) {
            setErrorMsg([...['Las contraseñas deben coincidir']])
            setLoading.off()
            return
        }

        const res = await fetch('/api/change-password', {
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (res.ok) {
            setSuccess.on()
        } else {
            const errorData = await res.json()
            setErrorMsg([...[errorData.details.message]])
        }
        setLoading.off()
    }

    const onError = () => {
        setErrorMsg([])
        setSuccess.off()

        let msg: string[] = []
        for (const [key, value] of Object.entries(errors)) {
            if (value?.message !== undefined) {
                msg.push(value?.message?.toString())
            }
        }
        setErrorMsg([...errorMsg])
        setErrorMsg([...msg])
    }


    return (
        <div>
            {errorMsg?.length !== 0 &&
                <div className="p-10">
                    <Error msg={errorMsg !== null ? errorMsg : 'Error al cambiar la contraseña'} />
                </div>
            }
            {success && 
            <div className="p-10">
                <Success msg="Contraseña actualizada satisfactoriamente!" />
            </div>}
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Stack direction={['column', 'row']} gap={[0, 10]}>
                    <Box width='50%'>
                        <Text fontSize='2xl' fontWeight='bold'>Cambiar dirección de correo electrónico</Text>
                        <Box display='flex' flexDirection='column' maxW='md' p={4}>
                            <FormControl>
                                <Stack direction='row'>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <Badge colorScheme='purple' h='1.7rem' rounded='lg' p={1} title="Nuestra plataforma todavía no puede cambiar su dirección de correo electrónico, ¡en un futuro lo implementaremos!">
                                        En un futuro
                                    </Badge>
                                </Stack>
                                <Input type='email' disabled defaultValue={user.data?.email}></Input>
                                <Button isDisabled={true} mt={4}>Cambiar correo</Button>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box width='50%'>
                        <Text fontSize='2xl' fontWeight='bold'>Cambiar contraseña</Text>
                        <Box display='flex' flexDirection='column' maxW='md' p={4}>
                            <FormControl>
                                <FormLabel>Contraseña actual</FormLabel>
                                <InputGroup>
                                    <Input type={verActual ? 'text' : 'password'} {...register('actual', {
                                        required: 'Por motivos de seguridad, debe introducir su contraseña actual.'
                                    })}></Input>
                                    <InputRightElement>
                                        <IconButton onClick={setVerActual.toggle} fontSize='2xl' aria-label='Ver contraseña' icon={verActual ? <GrFormViewHide /> : <GrFormView />}>
                                        </IconButton>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nueva contraseña</FormLabel>
                                <InputGroup>
                                    <Input type={verPwd1 ? 'text' : 'password'} {...register('pw1', {
                                        required: 'Si desea cambiar su contraseña, introduzca su nueva contraseña.'
                                    })}></Input>
                                    <InputRightElement>
                                        <IconButton onClick={setVerPwd1.toggle} fontSize='2xl' aria-label='Ver contraseña' icon={verPwd1 ? <GrFormViewHide /> : <GrFormView />}>
                                        </IconButton>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Confirmar nueva contraseña</FormLabel>
                                <InputGroup>
                                    <Input type={verPwd2 ? 'text' : 'password'} {...register('pw2', {
                                        required: 'Confirme su contraseña.'
                                    })}></Input>
                                    <InputRightElement>
                                        <IconButton onClick={setVerPwd2.toggle} fontSize='2xl' aria-label='Ver contraseña' icon={verPwd2 ? <GrFormViewHide /> : <GrFormView />}>
                                        </IconButton>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button type="submit" mt={4} isLoading={loading}>Cambiar contraseña</Button>
                        </Box>
                    </Box>
                </Stack>
            </form>
        </div>
    )
}