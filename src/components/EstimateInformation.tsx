import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Text,
  Input,
  Select,
} from '@chakra-ui/react';
import { FormData } from '../types';  // Import from types instead of App

interface EstimateInformationProps {
  control: Control<FormData>;
  exchangeRates: { [key: string]: number };
}

const EstimateInformation: React.FC<EstimateInformationProps> = ({ control, exchangeRates }) => {
  return (
    <Card border="1px" borderColor="gray.200" borderRadius="md">
      <CardBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text>Estimate Title</Text>
            <Controller
              name="estimateTitle"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Estimate Title" />}
            />
          </GridItem>
          <GridItem>
            <Text>Estimate Number</Text>
            <Controller
              name="estimateNumber"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Estimate Number" />}
            />
          </GridItem>
          <GridItem>
            <Text>Estimate Date</Text>
            <Controller
              name="estimateDate"
              control={control}
              render={({ field }) => <Input {...field} type="date" />}
            />
          </GridItem>
          <GridItem>
            <Text>Expiration Date</Text>
            <Controller
              name="expirationDate"
              control={control}
              render={({ field }) => <Input {...field} type="date" />}
            />
          </GridItem>
          <GridItem>
            <Text>Currency</Text>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {Object.keys(exchangeRates).map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </Select>
              )}
            />
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default EstimateInformation;
