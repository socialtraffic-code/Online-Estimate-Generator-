import React from 'react';
import { Controller, Control, useFieldArray } from 'react-hook-form';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Text,
  Input,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { FormData, CustomField } from '../types';  // Import from types instead of App

interface BusinessDetailsProps {
  control: Control<FormData>;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "businessDetails.customFields",
  });

  return (
    <Card>
      <CardBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text>Business Name</Text>
            <Controller
              name="businessDetails.name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Business Name" />}
            />
          </GridItem>
          <GridItem>
            <Text>Business Phone</Text>
            <Controller
              name="businessDetails.phone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Business Phone" />}
            />
          </GridItem>
          <GridItem>
            <Text>Business Email</Text>
            <Controller
              name="businessDetails.email"
              control={control}
              render={({ field }) => <Input {...field} type="email" placeholder="Business Email" />}
            />
          </GridItem>
          <GridItem>
            <Text>Business Website</Text>
            <Controller
              name="businessDetails.website"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Business Website" />}
            />
          </GridItem>
        </Grid>
        <VStack spacing={4} align="stretch" mt={4}>
          <Text fontSize="lg" fontWeight="bold">Custom Fields</Text>
          {fields.map((field, index) => (
            <HStack key={field.id}>
              <Controller
                name={`businessDetails.customFields.${index}.key` as const}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Field Name"
                  />
                )}
              />
              <Controller
                name={`businessDetails.customFields.${index}.value` as const}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Field Value"
                  />
                )}
              />
              <Button onClick={() => remove(index)} colorScheme="red">
                <FiTrash2 />
              </Button>
            </HStack>
          ))}
          <Button
            onClick={() => append({ key: '', value: '' } as CustomField)}
            leftIcon={<FiPlus />}
            bg="#0447FE"
            color="white"
            _hover={{ bg: '#0336D4' }}
          >
            Add Custom Field
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BusinessDetails;
