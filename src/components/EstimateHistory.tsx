import React from 'react';
import { Box, VStack, Text, Button, HStack, Select, Divider, useColorModeValue } from '@chakra-ui/react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { Estimate } from '../types';
import EstimateChart from './EstimateChart';

interface EstimateHistoryProps {
  estimates: Estimate[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const EstimateHistory: React.FC<EstimateHistoryProps> = ({ estimates, onDelete, onUpdateStatus }) => {
  const sortedEstimates = [...estimates].sort((a, b) => new Date(b.estimateDate).getTime() - new Date(a.estimateDate).getTime());

  const cardBgColor = useColorModeValue('transparent', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack spacing={6} align="stretch">
      <EstimateChart estimates={sortedEstimates} />
      {sortedEstimates.map((estimate) => (
        <Box key={estimate.id} borderWidth="1px" borderRadius="md" p={6} bg={cardBgColor} borderColor={borderColor}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Estimate #{estimate.estimateNumber}
              </Text>
              <Select
                size="sm"
                variant="outline"
                onChange={(e) => onUpdateStatus(estimate.id, e.target.value)}
                value={estimate.status}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </Select>
            </HStack>
            <Divider />
            <Box>
              <Text><strong>Estimate Date:</strong> {estimate.estimateDate}</Text>
              <Text><strong>Client Name:</strong> {estimate.clientName}</Text>
              <Text><strong>Total Amount:</strong> {estimate.totalAmount}</Text>
            </Box>
            <HStack mt={4} spacing={4} justify="flex-end">
              <Button
                as="a"
                href={estimate.pdfUrl}
                download={`estimate-${estimate.estimateNumber}.pdf`}
                colorScheme="green"
                leftIcon={<FiDownload />}
                _hover={{ bg: 'green.500' }}
                _active={{ bg: 'green.700' }}
              >
                Download PDF
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiTrash2 />}
                onClick={() => onDelete(estimate.id)}
                _hover={{ bg: 'red.500' }}
                _active={{ bg: 'red.700' }}
              >
                Delete
              </Button>
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default EstimateHistory;
