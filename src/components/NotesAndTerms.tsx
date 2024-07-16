import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import { FormData } from '../App';

interface NotesAndTermsProps {
  control: Control<FormData>;
}

const NotesAndTerms: React.FC<NotesAndTermsProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Notes and Terms</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Additional Notes"
                rows={4}
              />
            )}
          />
          <Controller
            name="termsAndConditions"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Terms and Conditions"
                rows={6}
              />
            )}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};

export default NotesAndTerms;