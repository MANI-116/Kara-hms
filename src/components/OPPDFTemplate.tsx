import {
  Page,
  Text,
  View,
  Document,
  StyleSheet, renderToStream
} from "@react-pdf/renderer";


const fontFamily = "Helvetica";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f9fafb",
    fontFamily,
    padding: 30,
  },
  header: {
    textAlign: "center",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#2563eb",
  },
  section: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 4,
    fontSize: 13,
    fontWeight: "bold",
    color: "#334155",
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    marginVertical: 2,
    lineHeight:1
  },
  fieldLabel: {
    width: "40%",
    color: "#374151",
    fontWeight: "bold",
    lineHeight:1
  },
  fieldValue: {
    width: "60%",
    color: "#111827",
    lineHeight:1
  },
  vitalBox: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    
  },
  footer: {
    marginTop: 25,
    textAlign: "right",
    fontSize: 10,
    color: "#6b7280",
  }
});

export const OPPDFDocument = ({
  opRecord
}: {
  opRecord: any;
}) => {

    
    return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>JAMAL HOSPITAL</Text>
        <Text style={styles.subtitle}>OutPatient Form</Text>
      </View>

      {/* Patient Info */}
      <Text style={styles.section}>Patient Information</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <Text style={styles.fieldValue}>{opRecord?.fullName}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Patient ID:</Text>
        <Text style={styles.fieldValue}>{opRecord?.id}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Age / Gender:</Text>
        <Text style={styles.fieldValue}>
          {opRecord?.age} / {opRecord?.gender}
        </Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Blood Group:</Text>
        <Text style={styles.fieldValue}>
          {opRecord?.bloodGroup || "—"}
        </Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Contact:</Text>
        <Text style={styles.fieldValue}>{opRecord?.contact}</Text>
      </View>

      {/* IP Details */}
      <Text style={styles.section}>OutPatient Details</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Department:</Text>
        <Text style={styles.fieldValue}>{opRecord?.department}</Text>
      </View>
      {/* <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Priority:</Text>
        <Text style={styles.fieldValue}>{opRecord?.priority}</Text>
      </View> */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Visit Date:</Text>
        <Text style={styles.fieldValue}>{opRecord.visitDate}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Valid for 24hrs from the same day</Text>
        
      </View>

      {/* Chief Complaint */}
      {/* <Text style={styles.section}>Chief Complaint</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {opRecord?.chiefComplaint || "—"}
      </Text> */}

      {/* Reason for Visit */}
      {/* <Text style={styles.section}>Reason for Visit</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {opRecord?.reasonForVisit || "—"}
      </Text> */}

      {/* Current Medications */}
      {/* <Text style={styles.section}>Current Medications</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {opRecord?.currentMedications || "—"}
      </Text> */}

      {/* Vital Signs */}
      <Text style={styles.section}>Vital Signs</Text>
      <View style={styles.vitalBox}>
        <Text style={{ fontSize: 10 }}>
          • Weight: {opRecord?.vitalSigns?.weight || "—"} kg
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Height: {opRecord?.vitalSigns?.height || "—"} cm
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Temperature: {opRecord?.vitalSigns?.temperature || "—"} °C
        </Text>
        <Text style={{ fontSize: 10 }}>
          • BP: {opRecord?.vitalSigns?.bloodPressureSystolic || "—"}/
          {opRecord?.vitalSigns?.bloodPressureDiastolic || "—"} mmHg
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Pulse: {opRecord?.vitalSigns?.pulse || "—"} bpm
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Resp. Rate: {opRecord?.vitalSigns?.respiratoryRate || "—"} /min
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Oxygen Saturation: {opRecord?.vitalSigns?.oxygenSaturation || "—"} %
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
)
};
