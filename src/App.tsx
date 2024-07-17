import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  extendTheme,
  Button,
  Box,
  Flex,
  Heading,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { FiDownload, FiMoon, FiSun } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import netlifyIdentity from 'netlify-identity-widget';
import EstimatePDF from './components/EstimatePDF';
import EstimateInformation from './components/EstimateInformation';
import BusinessDetails from './components/BusinessDetails';
import ClientDetails from './components/ClientDetails';
import ItemList from './components/ItemList';
import TotalsAndAdjustments from './components/TotalsAndAdjustments';
import NotesAndTerms from './components/NotesAndTerms';
import DesignSettings from './components/DesignSettings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EstimateHistory from './components/EstimateHistory';
import { FormData, DesignSettings as DesignSettingsType, Estimate, NetlifyUser, AppState } from './types';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      500: '#38B2AC',
      900: '#234E52',
    },
  },
});

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    designSettings: {
      primaryColor: '#38B2AC',
      secondaryColor: '#4A5568',
      fontFamily: 'Helvetica',
      logo: null,
    },
    estimates: [],
    exchangeRates: {},
  });

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      estimateTitle: 'Renovation Estimate',
      estimateNumber: uuidv4(),
      estimateDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      businessDetails: {
        name: '',
        phone: '',
        email: '',
        website: '',
        customFields: [],
      },
      clientDetails: {
        name: '',
        phone: '',
        address: '',
        email: '',
        customFields: [],
      },
      items: [{ id: uuidv4(), description: '', rate: 0, quantity: 1, tax: true, additionalDetails: '' }],
      tax: 10,
      discount: { type: 'percentage', value: 0 },
      currency: 'USD',
      notes: '',
      termsAndConditions: '',
    }
  });

  useEffect(() => {
    netlifyIdentity.init();

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setState(prevState => ({ ...prevState, exchangeRates: response.data.rates }));
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        toast({
          title: "Error fetching exchange rates",
          description: "Using USD as default. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchExchangeRates();

    const savedEstimates = localStorage.getItem('estimates');
    if (savedEstimates) {
      setState(prevState => ({ ...prevState, estimates: JSON.parse(savedEstimates) }));
    }

    const user = netlifyIdentity.currentUser();
    if (user) {
      setState(prevState => ({ ...prevState, user: user as NetlifyUser }));
    }

    netlifyIdentity.on('login', (user: NetlifyUser) => {
      setState(prevState => ({ ...prevState, user }));
    });

    netlifyIdentity.on('logout', () => {
      setState(prevState => ({ ...prevState, user: null }));
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, [toast]);

  const setUser: React.Dispatch<React.SetStateAction<NetlifyUser | null>> = useCallback((userOrFunction) => {
    setState((prevState) => ({
      ...prevState,
      user: typeof userOrFunction === 'function' ? userOrFunction(prevState.user) : userOrFunction,
    }));
  }, []);

  const generatePDF = async (data: FormData) => {
    try {
      const blob = await pdf(<EstimatePDF data={data} designSettings={state.designSettings} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estimate-${data.estimateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    const pdfUrl = await generatePDF(data);

    if (pdfUrl) {
      toast({
        title: "Estimate generated successfully.",
        description: "Your PDF has been downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const newEstimate: Estimate = {
        id: uuidv4(),
        estimateNumber: data.estimateNumber,
        estimateDate: data.estimateDate,
        clientName: data.clientDetails.name,
        totalAmount: calculateTotalAmount(data),
        pdfUrl: pdfUrl,
        status: "Pending",
      };

      const updatedEstimates = [...state.estimates, newEstimate];
      setState(prevState => ({ ...prevState, estimates: updatedEstimates }));
      localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to generate the estimate PDF. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculateTotalAmount = (data: FormData): string => {
    const subtotal = data.items.reduce((acc, item) => acc + item.rate * item.quantity, 0);
    const taxAmount = (subtotal * data.tax) / 100;
    let discountAmount = 0;
    if (data.discount.type === 'percentage') {
      discountAmount = (subtotal * data.discount.value) / 100;
    } else {
      discountAmount = data.discount.value;
    }
    const total = subtotal + taxAmount - discountAmount;
    return total.toFixed(2);
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettingsType>> = useCallback((settingsOrFunction) => {
    setState((prevState) => ({
      ...prevState,
      designSettings: typeof settingsOrFunction === 'function' ? settingsOrFunction(prevState.designSettings) : settingsOrFunction,
    }));
  }, []);

  const handleDelete = (id: string) => {
    const updatedEstimates = state.estimates.filter(estimate => estimate.id !== id);
    setState(prevState => ({ ...prevState, estimates: updatedEstimates }));
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
  };

  const handleUpdateStatus = (id: string, status: string) => {
    const updatedEstimates = state.estimates.map(estimate => 
      estimate.id === id ? { ...estimate, status } : estimate
    );
    setState(prevState => ({ ...prevState, estimates: updatedEstimates }));
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
  };

  const currency = watch('currency');

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const colorModeButtonBg = useColorModeValue('gray.100', 'whiteAlpha.200');
  const colorModeButtonColor = useColorModeValue('gray.800', 'white');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={6}>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h1" size="xl">Professional Estimate Generator</Heading>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color={colorModeButtonColor}
              bg={colorModeButtonBg}
              _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.300') }}
            />
          </Flex>
          
          <Grid templateColumns={{ base: "1fr", lg: "400px 1fr" }} gap={6}>
            <GridItem>
              {state.user ? (
                <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                  <CardHeader>
                    <Heading size="md">Welcome, {state.user.user_metadata.full_name}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Button onClick={handleLogout} colorScheme="blue">Logout</Button>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                    <CardBody>
                      <Login setUser={setUser} />
                    </CardBody>
                  </Card>
                  <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" mt={6} p={6}>
                    <CardHeader>
                      <Heading size="md">Sign Up</Heading>
                    </CardHeader>
                    <CardBody>
                      <SignUp setUser={setUser} />
                    </CardBody>
                  </Card>
                </>
              )}
            </GridItem>
            
            <GridItem>
              <Tabs variant="enclosed" colorScheme="brand">
                <TabList>
                  <Tab>Estimate Details</Tab>
                  <Tab>Design Settings</Tab>
                  <Tab>Estimate History</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <VStack spacing={6} align="stretch">
                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Estimate Information</Heading>
                          </CardHeader>
                          <CardBody>
                            <EstimateInformation control={control} exchangeRates={state.exchangeRates} />
                          </CardBody>
                        </Card>

                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Business Details</Heading>
                          </CardHeader>
                          <CardBody>
                            <BusinessDetails control={control} />
                          </CardBody>
                        </Card>

                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Client Details</Heading>
                          </CardHeader>
                          <CardBody>
                            <ClientDetails control={control} setValue={setValue} />
                          </CardBody>
                        </Card>

                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Item List</Heading>
                          </CardHeader>
                          <CardBody>
                            <ItemList control={control} currency={currency} />
                          </CardBody>
                        </Card>

                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Totals and Adjustments</Heading>
                          </CardHeader>
                          <CardBody>
                            <TotalsAndAdjustments control={control} />
                          </CardBody>
                        </Card>

                        <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                          <CardHeader>
                            <Heading size="md">Notes and Terms</Heading>
                          </CardHeader>
                          <CardBody>
                            <NotesAndTerms control={control} />
                          </CardBody>
                        </Card>

                        <Button
                          type="submit"
                          colorScheme="brand"
                          size="lg"
                          leftIcon={<FiDownload />}
                          width="full"
                        >
                          Generate and Download Estimate
                        </Button>
                      </VStack>
                    </form>
                  </TabPanel>

                  <TabPanel>
                    <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                      <CardHeader>
                        <Heading size="md">Design Settings</Heading>
                      </CardHeader>
                      <CardBody>
                        <DesignSettings designSettings={state.designSettings} setDesignSettings={setDesignSettings} />
                      </CardBody>
                    </Card>
                  </TabPanel>

                  <TabPanel>
                    <Card bg={cardBgColor} borderWidth="1px" borderColor={cardBorderColor} borderRadius="md" p={6}>
                      <CardHeader>
                        <Heading size="md">Estimate History</Heading>
                      </CardHeader>
                      <CardBody>
                        <EstimateHistory 
                          estimates={state.estimates} 
                          onDelete={handleDelete} 
                          onUpdateStatus={handleUpdateStatus} 
                        />
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
