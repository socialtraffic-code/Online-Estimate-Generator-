import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { FormData, DesignSettings, Item, CustomField } from '../App';

// Register fonts
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9V1s.ttf', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
  ],
});

const styles = (designSettings: DesignSettings) => StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'column',
    maxWidth: '70%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: designSettings.primaryColor,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: designSettings.secondaryColor,
  },
  logo: {
    width: 160, // Increased the width for a bigger logo
    height: 70, // Increased the height for a bigger logo
    objectFit: 'contain',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: designSettings.primaryColor,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: designSettings.secondaryColor,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    width: '40%',
    fontWeight: 'medium',
    color: designSettings.secondaryColor,
  },
  detailValue: {
    width: '60%',
  },
  tableContainer: {
    marginTop: 10,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableHeader: {
    backgroundColor: designSettings.primaryColor,
  },
  tableHeaderCell: {
    padding: 8,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'medium',
    textAlign: 'left',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    textAlign: 'left',
  },
  tableCellDescription: { width: '35%' },
  tableCellQuantity: { width: '15%' },
  tableCellRate: { width: '15%' },
  tableCellAmount: { width: '20%' },
  tableCellDetails: { width: '15%' },
  totalsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: designSettings.primaryColor,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  totalLabel: {
    width: '30%',
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'medium',
    color: designSettings.secondaryColor,
  },
  totalValue: {
    width: '20%',
    textAlign: 'right',
    fontWeight: 'medium',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: designSettings.primaryColor,
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: designSettings.secondaryColor,
  },
  notesSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: designSettings.secondaryColor,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
});

interface EstimatePDFProps {
  data: FormData;
  designSettings: DesignSettings;
}

const EstimatePDF: React.FC<EstimatePDFProps> = ({ data, designSettings }) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const renderCustomFields = (fields: CustomField[]) => {
    return fields.map((field, index) => (
      <View key={index} style={styles(designSettings).detailRow}>
        <Text style={styles(designSettings).detailLabel}>{field.key}:</Text>
        <Text style={styles(designSettings).detailValue}>{field.value}</Text>
      </View>
    ));
  };

  const renderItems = (items: Item[]) => {
    return items.map((item, index) => (
      <View key={index} style={[
        styles(designSettings).tableRow,
        index % 2 === 0 ? styles(designSettings).tableRowEven : {}
      ]}>
        <Text style={[styles(designSettings).tableCell, styles(designSettings).tableCellDescription]}>{item.description}</Text>
        <Text style={[styles(designSettings).tableCell, styles(designSettings).tableCellQuantity]}>{item.quantity}</Text>
        <Text style={[styles(designSettings).tableCell, styles(designSettings).tableCellRate]}>{formatCurrency(item.rate)}</Text>
        <Text style={[styles(designSettings).tableCell, styles(designSettings).tableCellAmount]}>{formatCurrency(item.quantity * item.rate)}</Text>
        <Text style={[styles(designSettings).tableCell, styles(designSettings).tableCellDetails]}>{item.additionalDetails}</Text>
      </View>
    ));
  };

  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * (data.tax / 100);
  };

  const calculateDiscount = (subtotal: number) => {
    if (data.discount.type === 'percentage') {
      return subtotal * (data.discount.value / 100);
    }
    return data.discount.value;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discount = calculateDiscount(subtotal);
    return subtotal + tax - discount;
  };

  return (
    <Document>
      <Page size="A4" style={styles(designSettings).page}>
        <View style={styles(designSettings).header}>
          <View style={styles(designSettings).headerLeft}>
            <Text style={styles(designSettings).headerTitle}>{data.estimateTitle}</Text>
            <Text style={styles(designSettings).headerSubtitle}>Estimate #{data.estimateNumber}</Text>
          </View>
          {designSettings.logo && <Image src={designSettings.logo} style={styles(designSettings).logo} />}
        </View>

        <View style={styles(designSettings).twoColumnLayout}>
          <View style={styles(designSettings).column}>
            <View style={styles(designSettings).section}>
              <Text style={styles(designSettings).sectionTitle}>Business</Text>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Company:</Text>
                <Text style={styles(designSettings).detailValue}>{data.businessDetails.name}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Phone:</Text>
                <Text style={styles(designSettings).detailValue}>{data.businessDetails.phone}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Email:</Text>
                <Text style={styles(designSettings).detailValue}>{data.businessDetails.email}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Website:</Text>
                <Text style={styles(designSettings).detailValue}>{data.businessDetails.website}</Text>
              </View>
              {renderCustomFields(data.businessDetails.customFields)}
            </View>
          </View>
          <View style={styles(designSettings).column}>
            <View style={styles(designSettings).section}>
              <Text style={styles(designSettings).sectionTitle}>Client</Text>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Name:</Text>
                <Text style={styles(designSettings).detailValue}>{data.clientDetails.name}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Address:</Text>
                <Text style={styles(designSettings).detailValue}>{data.clientDetails.address}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Phone:</Text>
                <Text style={styles(designSettings).detailValue}>{data.clientDetails.phone}</Text>
              </View>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Email:</Text>
                <Text style={styles(designSettings).detailValue}>{data.clientDetails.email}</Text>
              </View>
              {renderCustomFields(data.clientDetails.customFields)}
            </View>
          </View>
        </View>

        <View style={styles(designSettings).section}>
          <Text style={styles(designSettings).sectionTitle}>Estimate Details</Text>
          <View style={styles(designSettings).twoColumnLayout}>
            <View style={styles(designSettings).column}>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Date:</Text>
                <Text style={styles(designSettings).detailValue}>{data.estimateDate}</Text>
              </View>
            </View>
            <View style={styles(designSettings).column}>
              <View style={styles(designSettings).detailRow}>
                <Text style={styles(designSettings).detailLabel}>Expiration:</Text>
                <Text style={styles(designSettings).detailValue}>{data.expirationDate}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles(designSettings).section}>
          <Text style={styles(designSettings).sectionTitle}>Items</Text>
          <View style={styles(designSettings).tableContainer}>
            <View style={[styles(designSettings).tableRow, styles(designSettings).tableHeader]}>
              <Text style={[styles(designSettings).tableHeaderCell, styles(designSettings).tableCellDescription]}>Description</Text>
              <Text style={[styles(designSettings).tableHeaderCell, styles(designSettings).tableCellQuantity]}>Qty</Text>
              <Text style={[styles(designSettings).tableHeaderCell, styles(designSettings).tableCellRate]}>Rate</Text>
              <Text style={[styles(designSettings).tableHeaderCell, styles(designSettings).tableCellAmount]}>Amount</Text>
              <Text style={[styles(designSettings).tableHeaderCell, styles(designSettings).tableCellDetails]}>Details</Text>
            </View>
            {renderItems(data.items)}
          </View>
        </View>

        <View style={styles(designSettings).totalsSection}>
          <View style={styles(designSettings).totalRow}>
            <Text style={styles(designSettings).totalLabel}>Subtotal:</Text>
            <Text style={styles(designSettings).totalValue}>{formatCurrency(calculateSubtotal())}</Text>
          </View>
          <View style={styles(designSettings).totalRow}>
            <Text style={styles(designSettings).totalLabel}>
              Discount ({data.discount.type === 'percentage' ? `${data.discount.value}%` : 'Fixed'}):
            </Text>
            <Text style={styles(designSettings).totalValue}>{formatCurrency(calculateDiscount(calculateSubtotal()))}</Text>
          </View>
          <View style={styles(designSettings).totalRow}>
            <Text style={styles(designSettings).totalLabel}>Tax ({data.tax}%):</Text>
            <Text style={styles(designSettings).totalValue}>{formatCurrency(calculateTax(calculateSubtotal()))}</Text>
          </View>
          <View style={[styles(designSettings).totalRow, styles(designSettings).grandTotal]}>
            <Text style={styles(designSettings).totalLabel}>Total:</Text>
            <Text style={styles(designSettings).totalValue}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>

        {(data.notes || data.termsAndConditions) && (
          <View style={styles(designSettings).notesSection}>
            {data.notes && (
              <View>
                <Text style={styles(designSettings).sectionTitle}>Notes</Text>
                <Text>{data.notes}</Text>
              </View>
            )}
            {data.termsAndConditions && (
              <View style={{ marginTop: data.notes ? 10 : 0 }}>
                <Text style={styles(designSettings).sectionTitle}>Terms and Conditions</Text>
                <Text>{data.termsAndConditions}</Text>
              </View>
            )}
          </View>
        )}
        <Text style={styles(designSettings).footer}>
          Thank you for your business. For any inquiries, please contact us at {data.businessDetails.email} or {data.businessDetails.phone}.
        </Text>
      </Page>
    </Document>
  );
};

export default EstimatePDF;
