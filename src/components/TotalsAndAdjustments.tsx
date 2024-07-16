import React from 'react';
import { Controller, Control, useWatch } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  Input,
  Select,
  Text,
  Box,
} from '@chakra-ui/react';
import { FormData } from '../App';

interface TotalsAndAdjustmentsProps {
  control: Control<FormData>;
}

const TotalsAndAdjustments: React.FC<TotalsAndAdjustmentsProps> = ({ control }) => {
  const items = useWatch({ control, name: 'items' });
  const taxRate = useWatch({ control, name: 'tax' });
  const discount = useWatch({ control, name: 'discount' });
  const currency = useWatch({ control, name: 'currency' });

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.rate) * item.quantity), 0);
  };

  const calculateTaxAmount = () => {
    return items.reduce((sum, item) => {
      if (item.tax) {
        return sum + (Number(item.rate) * item.quantity * (taxRate / 100));
      }
      return sum;
    }, 0);
  };

  const calculateDiscountAmount = (subtotal: number) => {
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    } else {
      return discount.value;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    const discountAmount = calculateDiscountAmount(subtotal);
    return subtotal + taxAmount - discountAmount;
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Totals and Adjustments</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text>Subtotal:</Text>
            <Text>{currency} {formatCurrency(calculateSubtotal())}</Text>
          </HStack>
          <HStack>
            <Text>Tax Rate (%):</Text>
            <Controller
              name="tax"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </HStack>
          <HStack>
            <Text>Discount:</Text>
            <Controller
              name="discount.value"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
            <Controller
              name="discount.type"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </Select>
              )}
            />
          </HStack>
          <HStack justify="space-between">
            <Text>Tax Amount:</Text>
            <Text>{currency} {formatCurrency(calculateTaxAmount())}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Discount Amount:</Text>
            <Text>{currency} {formatCurrency(calculateDiscountAmount(calculateSubtotal()))}</Text>
          </HStack>
          <Box backgroundColor="gray.100" p={4} borderRadius="md">
            <HStack justify="space-between">
              <Heading size="md">Total:</Heading>
              <Heading size="md">{currency} {formatCurrency(calculateTotal())}</Heading>
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default TotalsAndAdjustments;