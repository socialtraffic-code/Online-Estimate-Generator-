import React from 'react';
import { Controller, Control, useFieldArray } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { FiPlus, FiMinusCircle } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { FormData, Item } from '../types';  // Import from types instead of App

interface ItemListProps {
  control: Control<FormData>;
  currency: string;
}

const ItemList: React.FC<ItemListProps> = ({ control, currency }) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    move(result.source.index, result.destination.index);
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Items</Heading>
      </CardHeader>
      <CardBody>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <VStack spacing={4} {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <HStack
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        w="full"
                        p={2}
                        borderWidth={1}
                        borderRadius="md"
                      >
                        <VStack align="stretch" flex={1}>
                          <Controller
                            name={`items.${index}.description`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Item Description" />}
                          />
                          <HStack>
                            <VStack align="stretch" flex={1}>
                              <Text>Rate</Text>
                              <Controller
                                name={`items.${index}.rate`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder={`Rate (${currency})`}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                )}
                              />
                            </VStack>
                            <VStack align="stretch" flex={1}>
                              <Text>Quantity</Text>
                              <Controller
                                name={`items.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="Quantity"
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                  />
                                )}
                              />
                            </VStack>
                          </HStack>
                          <Controller
                            name={`items.${index}.additionalDetails`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Additional Details" />}
                          />
                          <Controller
                            name={`items.${index}.tax`}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                isChecked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              >
                                Apply Tax
                              </Checkbox>
                            )}
                          />
                        </VStack>
                        <Button onClick={() => remove(index)} colorScheme="red">
                          <FiMinusCircle />
                        </Button>
                      </HStack>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          onClick={() => append({
            id: uuidv4(),
            description: '',
            rate: 0,
            quantity: 1,
            tax: true,
            additionalDetails: ''
          } as Item)}
          leftIcon={<FiPlus />}
          mt={4}
          bg="#0447FE"
          color="white"
          _hover={{ bg: '#0336D4' }}
        >
          Add Item
        </Button>
      </CardBody>
    </Card>
  );
};

export default ItemList;