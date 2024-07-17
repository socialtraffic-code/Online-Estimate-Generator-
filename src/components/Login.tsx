import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Box,
  Heading,
  Text,
  Link,
  Checkbox,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import netlifyIdentity from 'netlify-identity-widget';
import { AuthComponentProps, NetlifyUser } from '../types';

const Login: React.FC<AuthComponentProps> = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await netlifyIdentity.login(email, password, rememberMe, (user: NetlifyUser) => {
        setUser(user);
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      maxWidth="400px"
      width="100%"
    >
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="xl" textAlign="center" color="#0447FE">
          Welcome Back
        </Heading>
        <Button
          leftIcon={<FcGoogle />}
          onClick={() => netlifyIdentity.authorize({ provider: 'google' })}
          width="full"
          variant="outline"
          colorScheme="gray"
        >
          Continue with Google
        </Button>
        <Flex align="center">
          <Divider />
          <Text padding="1" fontSize="sm" color="gray.500">
            OR
          </Text>
          <Divider />
        </Flex>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            bg="gray.50"
            border="1px"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              bg="gray.50"
              border="1px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
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
        </FormControl>
        <Flex justify="space-between" align="center">
          <Checkbox
            isChecked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            colorScheme="blue"
          >
            Remember me
          </Checkbox>
          <Link color="#0447FE" fontSize="sm" href="#" textDecoration="underline">
            Forgot password?
          </Link>
        </Flex>
        <Button
          onClick={handleLogin}
          isLoading={isLoading}
          loadingText="Logging in..."
          bg="#0447FE"
          color="white"
          width="full"
          _hover={{ bg: '#0336D4' }}
          _active={{ bg: '#022799' }}
        >
          Log In
        </Button>
        <Text fontSize="sm" textAlign="center">
          Don't have an account?{' '}
          <Link color="#0447FE" href="#" textDecoration="underline">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
