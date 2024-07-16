import React from 'react';
import { Controller, Control, useFieldArray, UseFormSetValue } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Grid,
  GridItem,
  Text,
  Input,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { FormData, CustomField } from '../App';

interface ClientDetailsProps {
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientDetails.customFields",
  });

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Client Details</Heading>
      </CardHeader>
      <CardBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text>Client Name</Text>
            <Controller
              name="clientDetails.name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Client Name" />}
            />
          </GridItem>
          <GridItem>
            <Text>Client Phone</Text>
            <Controller
              name="clientDetails.phone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Client Phone" />}
            />
          </GridItem>
          <GridItem>
            <Text>Client Email</Text>
            <Controller
              name="clientDetails.email"
              control={control}
              render={({ field }) => <Input {...field} type="email" placeholder="Client Email" />}
            />
          </GridItem>
          <GridItem>
            <Text>Client Address</Text>
            <Controller
              name="clientDetails.address"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Client Address" />}
            />
          </GridItem>
        </Grid>
        <VStack spacing={4} align="stretch" mt={4}>
          <Heading size="sm">Custom Fields</Heading>
          {fields.map((field, index) => (
            <HStack key={field.id} spacing={3}>
              <Controller
                name={`clientDetails.customFields.${index}.key`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Field Name"
                  />
                )}
              />
              <Controller
                name={`clientDetails.customFields.${index}.value`}
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

export default ClientDetails;
