import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type VehicleRow = {
  vehicleNumber: string;
  ownerName: string;
  ownerMobile: string;
  block: string;
  floor: number;
  apartmentName: string | null;
};

type VehiclePdfDocumentProps = {
  rows: VehicleRow[];
};

export function VehiclePdfDocument({ rows }: VehiclePdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Vrundavan Park</Text>
          <Text style={styles.subtitle}>Vehicle Register</Text>
          <Text style={styles.date}>Generated on {new Date().toDateString()}</Text>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={styles.colVehicle}>Vehicle</Text>
          <Text style={styles.colOwner}>Owner</Text>
          <Text style={styles.colMobile}>Mobile</Text>
          <Text style={styles.colBlock}>Block</Text>
          <Text style={styles.colFloor}>Floor</Text>
          <Text style={styles.colApartment}>Apartment</Text>
        </View>

        {/* TABLE ROWS */}
        {rows.map((row, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={styles.colVehicle}>{row.vehicleNumber}</Text>
            <Text style={styles.colOwner}>{row.ownerName}</Text>
            <Text style={styles.colMobile}>{row.ownerMobile}</Text>
            <Text style={styles.colBlock}>{row.block}</Text>
            <Text style={styles.colFloor}>{row.floor}</Text>
            <Text style={styles.colApartment}>{row.apartmentName}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  date: {
    fontSize: 8,
    marginTop: 4,
    color: '#555',
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5 solid #ccc',
    paddingVertical: 4,
  },

  colVehicle: { width: '16%' },
  colOwner: { width: '18%' },
  colMobile: { width: '18%' },
  colBlock: { width: '10%' },
  colFloor: { width: '8%' },
  colApartment: { width: '30%' },
});
