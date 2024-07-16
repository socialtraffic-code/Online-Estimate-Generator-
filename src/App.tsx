import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { FiDownload } from 'react-icons/fi';
import {
  ChakraProvider,
  extendTheme,
  Button,
  Box,
  Heading,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';

// Import components
import EstimatePDF from './components/EstimatePDF';
import EstimateInformation from './components/EstimateInformation';
import BusinessDetails from './components/BusinessDetails';
import ClientDetails from './components/ClientDetails';
import ItemList from './components/ItemList';
import TotalsAndAdjustments from './components/TotalsAndAdjustments';
import NotesAndTerms from './components/NotesAndTerms';
import DesignSettings from './components/DesignSettings';

// Define types
export interface CustomField {
  key: string;
  value: string;
}

export interface Item {
  id: string;
  description: string;
  rate: number;
  quantity: number;
  tax: boolean;
  additionalDetails: string;
}

export interface BusinessDetailsType {
  name: string;
  phone: string;
  email: string;
  website: string;
  customFields: CustomField[];
}

export interface ClientDetailsType {
  name: string;
  phone: string;
  address: string;
  email: string;
  customFields: CustomField[];
}

export interface FormData {
  estimateTitle: string;
  estimateNumber: string;
  estimateDate: string;
  expirationDate: string;
  businessDetails: BusinessDetailsType;
  clientDetails: ClientDetailsType;
  items: Item[];
  tax: number;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  currency: string;
  notes: string;
  termsAndConditions: string;
}

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo: string | null;
}

// Create a custom theme
const theme = extendTheme({
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
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    primaryColor: '#38B2AC',
    secondaryColor: '#4A5568',
    fontFamily: 'Helvetica',
    logo: null,
  });
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const toast = useToast();

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
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
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
  }, [toast]);

  const generatePDF = async (data: FormData) => {
    try {
      const blob = await pdf(<EstimatePDF data={data} designSettings={designSettings} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estimate-${data.estimateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    const success = await generatePDF(data);

    if (success) {
      toast({
        title: "Estimate generated successfully.",
        description: "Your PDF has been downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  return (
    <ChakraProvider theme={theme}>
      <Box maxWidth="1200px" margin="auto" padding={6}>
        <Heading as="h1" size="xl" marginBottom={6}>Professional Estimate Generator</Heading>
        
        <Tabs>
          <TabList>
            <Tab>Estimate Details</Tab>
            <Tab>Design Settings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6} align="stretch">
                  <EstimateInformation control={control} exchangeRates={exchangeRates} />
                  <BusinessDetails control={control} />
                  <ClientDetails control={control} setValue={setValue} />
                  <ItemList control={control} currency={watch('currency')} />
                  <TotalsAndAdjustments control={control} />
                  <NotesAndTerms control={control} />
                  <Button type="submit" colorScheme="blue" size="lg" leftIcon={<FiDownload />} backgroundColor="#111827" textColor="white">
                    Generate and Download Estimate
                  </Button>
                </VStack>
              </form>
            </TabPanel>

            <TabPanel>
              <DesignSettings designSettings={designSettings} setDesignSettings={setDesignSettings} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

export default App;