import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet
} from "@react-pdf/renderer";

// ✅ Use built-in Helvetica font (no remote URLs, no errors)
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
  },
  fieldLabel: {
    width: "40%",
    color: "#374151",
    fontWeight: "bold",
  },
  fieldValue: {
    width: "60%",
    color: "#111827",
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

export const IPPDFDocument = ({
  ipRecord,
  selectedPatient
}: {
  ipRecord: any;
  selectedPatient: any;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>JAMAL HOSPITAL</Text>
        <Text style={styles.subtitle}>Inpatient Admission Form</Text>
      </View>

      {/* Patient Info */}
      <Text style={styles.section}>Patient Information</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <Text style={styles.fieldValue}>{selectedPatient?.fullName}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Patient ID:</Text>
        <Text style={styles.fieldValue}>{selectedPatient?.id}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Age / Gender:</Text>
        <Text style={styles.fieldValue}>
          {selectedPatient?.age} / {selectedPatient?.gender}
        </Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Blood Group:</Text>
        <Text style={styles.fieldValue}>
          {selectedPatient?.bloodGroup || "—"}
        </Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Contact:</Text>
        <Text style={styles.fieldValue}>{selectedPatient?.contact}</Text>
      </View>

      {/* IP Details */}
      <Text style={styles.section}>Inpatient Details</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>IP Number:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.ipNumber}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Department:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.department}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Priority:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.priority}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Visit Date:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.visitDate}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Visit Time:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.visitTime}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Valid Until:</Text>
        <Text style={styles.fieldValue}>{ipRecord?.validUntil}</Text>
      </View>

      {/* Chief Complaint */}
      <Text style={styles.section}>Chief Complaint</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {ipRecord?.chiefComplaint || "—"}
      </Text>

      {/* Reason for Visit */}
      <Text style={styles.section}>Reason for Visit</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {ipRecord?.reasonForVisit || "—"}
      </Text>

      {/* Current Medications */}
      <Text style={styles.section}>Current Medications</Text>
      <Text style={{ fontSize: 11, color: "#1f2937" }}>
        {ipRecord?.currentMedications || "—"}
      </Text>

      {/* Vital Signs */}
      <Text style={styles.section}>Vital Signs</Text>
      <View style={styles.vitalBox}>
        <Text style={{ fontSize: 10 }}>
          • Weight: {ipRecord?.vitalSigns?.weight || "—"} kg
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Height: {ipRecord?.vitalSigns?.height || "—"} cm
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Temperature: {ipRecord?.vitalSigns?.temperature || "—"} °C
        </Text>
        <Text style={{ fontSize: 10 }}>
          • BP: {ipRecord?.vitalSigns?.bloodPressureSystolic || "—"}/
          {ipRecord?.vitalSigns?.bloodPressureDiastolic || "—"} mmHg
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Pulse: {ipRecord?.vitalSigns?.pulse || "—"} bpm
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Resp. Rate: {ipRecord?.vitalSigns?.respiratoryRate || "—"} /min
        </Text>
        <Text style={{ fontSize: 10 }}>
          • Oxygen Saturation: {ipRecord?.vitalSigns?.oxygenSaturation || "—"} %
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);
