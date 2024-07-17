import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Image,
  Button,
} from '@chakra-ui/react';
import { DesignSettings as DesignSettingsType } from '../types';  // Import from types instead of App

interface DesignSettingsProps {
  designSettings: DesignSettingsType;
  setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettingsType>>;
}

const DesignSettings: React.FC<DesignSettingsProps> = ({ designSettings, setDesignSettings }) => {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignSettings(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Design Settings</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack>
            <Text>Primary Color:</Text>
            <Input
              type="color"
              value={designSettings.primaryColor}
              onChange={(e) => setDesignSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
            />
          </HStack>
          <HStack>
            <Text>Secondary Color:</Text>
            <Input
              type="color"
              value={designSettings.secondaryColor}
              onChange={(e) => setDesignSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
            />
          </HStack>
          <HStack>
            <Text>Font Family:</Text>
            <Select
              value={designSettings.fontFamily}
              onChange={(e) => setDesignSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Times-Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </Select>
          </HStack>
          <VStack align="stretch">
            <Text>
              Company Logo: <span style={{ fontSize: '0.9em', color: 'gray' }}>(Best size: 200x100px, Accepted file types: JPG, PNG)</span>
            </Text>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {designSettings.logo && (
              <Image
                src={designSettings.logo}
                alt="Company Logo"
                maxWidth="200px"
                mt={4}
              />
            )}
          </VStack>
          {designSettings.logo && (
            <Button
              onClick={() => setDesignSettings(prev => ({ ...prev, logo: null }))}
              colorScheme="red"
            >
              Remove Logo
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default DesignSettings;