import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
  Divider,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, InfoIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import netlifyIdentity from 'netlify-identity-widget';
import { AuthComponentProps } from '../types';

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC<AuthComponentProps> = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormInputs>();

  const onSubmit = async (data: SignUpFormInputs) => {
    setIsLoading(true);
    try {
      const user = await netlifyIdentity.signup(data.email, data.password);
      console.log('Sign Up successful:', user);
      setUser(user);
      toast({
        title: 'Sign Up Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Sign Up failed:', error);
      toast({
        title: 'Sign Up Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Text textAlign="center">
        Don't have an account?{' '}
        <Link color="blue.500" fontWeight="medium" onClick={onOpen}>
          Sign Up
        </Link>
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">Create an Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Button
                leftIcon={<FcGoogle />}
                width="full"
                variant="outline"
                onClick={() => netlifyIdentity.authorize({ provider: 'google' })}
              >
                Sign Up with Google
              </Button>

              <Flex align="center" color="gray.300" my={4}>
                <Divider />
                <Text padding="2" fontSize="sm" color="gray.500">
                  OR
                </Text>
                <Divider />
              </Flex>

              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      bg="gray.50"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      placeholder="you@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email.message}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">
                      Password
                      <Tooltip label="Password must be at least 8 characters long" placement="top">
                        <InfoIcon boxSize={4} color="gray.400" ml={1} />
                      </Tooltip>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'gray.600' }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password.message}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        {...register('confirmPassword', {
                          required: 'Confirm Password is required',
                          validate: (value) =>
                            value === watch('password') || 'Passwords do not match',
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'gray.600' }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    width="full"
                    mt={4}
                    isLoading={isLoading}
                    loadingText="Signing up..."
                    colorScheme="blue"
                    _hover={{ bg: 'blue.600' }}
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            </VStack>
            <Box mt={4} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                By signing up, you agree to our{' '}
                <Link color="blue.500" href="#" isExternal>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link color="blue.500" href="#" isExternal>
                  Privacy Policy
                </Link>
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUp;