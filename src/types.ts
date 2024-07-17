import { Control, UseFormSetValue } from 'react-hook-form';
import React from 'react';

// User and Authentication
export interface NetlifyUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    [key: string]: string | number | boolean;
  };
  app_metadata: {
    provider: string;
    [key: string]: string | number | boolean;
  };
  token: {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    token_type: string;
  };
}

export interface AuthComponentProps {
  setUser: React.Dispatch<React.SetStateAction<NetlifyUser | null>>;
}

// Form Data Structures
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

// Design Settings
export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo: string | null;
}

// Estimate
export interface Estimate {
  id: string;
  estimateNumber: string;
  estimateDate: string;
  clientName: string;
  totalAmount: string;
  pdfUrl: string;
  status: string; // Added status field for tracking acceptance
}

// App State
export interface AppState {
  user: NetlifyUser | null;
  designSettings: DesignSettings;
  estimates: Estimate[];
  exchangeRates: { [key: string]: number };
}

// Component Props
export interface FormComponentProps {
  control: Control<FormData>;
  setValue?: UseFormSetValue<FormData>;
}

export interface ItemListProps extends FormComponentProps {
  currency: string;
}

export interface EstimateHistoryProps {
  estimates: Estimate[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export interface DesignSettingsProps {
  designSettings: DesignSettings;
  setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettings>>;
}

export interface EstimatePDFProps {
  data: FormData;
  designSettings: DesignSettings;
}

export interface EstimateInformationProps extends FormComponentProps {
  exchangeRates: { [key: string]: number };
}

export interface BusinessDetailsProps {
  control: Control<FormData>;
}

export interface ClientDetailsProps {
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export interface TotalsAndAdjustmentsProps extends FormComponentProps {
  // Add any additional props if needed
}

export interface NotesAndTermsProps extends FormComponentProps {
  // Add any additional props if needed
}
