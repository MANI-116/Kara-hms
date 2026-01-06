import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const fontFamily = "Helvetica";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily,
    padding: 40,
  },

  // Hospital Header
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 12,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
  },
  documentType: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    marginTop: 2,
  },

  // Top Info Bar (Patient ID + Visit Date inline)
  topInfoBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  topInfoItem: {
    display: "flex",
    flexDirection: "row",
    fontSize: 10,
  },
  topInfoLabel: {
    fontWeight: "bold",
    color: "#334155",
    marginRight: 6,
  },
  topInfoValue: {
    color: "#475569",
  },

  // Main Content Sections (unified, no artificial separation)
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#1e3a8a",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 8,
  },

  // 2-Column Grid for Fields
  gridContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  gridColumn: {
    flex: 1,
    paddingRight: 15,
  },

  fieldRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 3,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e3a8a",
    width: "35%",
    lineHeight: 1.3,
  },
  fieldValue: {
    fontSize: 10,
    color: "#0f172a",
    width: "65%",
    lineHeight: 1.3,
  },

  // Vital Signs Box
  vitalsSection: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bfdbfe",
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  vitalsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  vitalItem: {
    width: "50%",
    marginVertical: 4,
    fontSize: 10,
  },

  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    fontSize: 9,
    color: "#64748b",
    textAlign: "center",
  },
  footerText: {
    marginVertical: 2,
  },
});

export const OPPDFDocument = ({
  opRecord,
}: {
  opRecord: any;
}) => {
  const currentDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(Date.now());

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Hospital Header */}
        <View style={styles.header}>
          <Text style={styles.hospitalName}>JAMAL HOSPITALS</Text>
          <Text style={styles.documentType}>
            Out-Patient Medical Record
          </Text>
        </View>

        {/* Quick Info Bar: Patient ID & Visit Date */}
        <View style={styles.topInfoBar}>
          <View style={styles.topInfoItem}>
            <Text style={styles.topInfoLabel}>Record ID:</Text>
            <Text style={styles.topInfoValue}>{opRecord?.id}</Text>
          </View>
          <View style={styles.topInfoItem}>
            <Text style={styles.topInfoLabel}>Visit Date:</Text>
            <Text style={styles.topInfoValue}>{opRecord?.visitDate}</Text>
          </View>
          <View style={styles.topInfoItem}>
            <Text style={styles.topInfoLabel}>Generated:</Text>
            <Text style={styles.topInfoValue}>
              {currentDate} {currentTime}
            </Text>
          </View>
        </View>

        {/* Patient Demographics Section */}
        <Text style={styles.sectionTitle}>PATIENT DEMOGRAPHICS</Text>

        {/* Row 1: Name | Contact */}
        <View style={styles.gridContainer}>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Full Name:</Text>
              <Text style={styles.fieldValue}>{opRecord?.fullName}</Text>
            </View>
          </View>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Contact:</Text>
              <Text style={styles.fieldValue}>{opRecord?.contact}</Text>
            </View>
          </View>
        </View>

        {/* Row 2: Age/Gender | Blood Group */}
        <View style={styles.gridContainer}>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Age / Gender:</Text>
              <Text style={styles.fieldValue}>
                {opRecord?.age} yrs / {opRecord?.gender}
              </Text>
            </View>
          </View>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Blood Group:</Text>
              <Text style={styles.fieldValue}>
                {opRecord?.bloodGroup || "Not Recorded"}
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Visit Section */}
        <Text style={styles.sectionTitle}>CLINICAL VISIT DETAILS</Text>

        {/* Row 1: Assigned Doctor | Visit Validity */}
        <View style={styles.gridContainer}>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Assigned Doctor:</Text>
              <Text style={styles.fieldValue}>{opRecord?.assignedDoctor}</Text>
            </View>
          </View>
          <View style={styles.gridColumn}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Validity:</Text>
              <Text style={styles.fieldValue}>24 hours from visit date</Text>
            </View>
          </View>
        </View>

        {/* Vital Signs Section */}
        <Text style={styles.sectionTitle}>VITAL SIGNS</Text>
        <View style={styles.vitalsSection}>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Weight:</Text>{" "}
                {opRecord?.weight || "—"} kg
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Height:</Text>{" "}
                {opRecord?.height || "—"} cm
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Temperature:</Text>{" "}
                {opRecord?.temperature || "—"} °C
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Blood Pressure:</Text>{" "}
                {opRecord?.bloodPressureSystolic || "—"}/
                {opRecord?.bloodPressureDiastolic || "—"} mmHg
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Pulse Rate:</Text>{" "}
                {opRecord?.pulse || "—"} bpm
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Respiratory Rate:</Text>{" "}
                {opRecord?.respiratoryRate || "—"} /min
              </Text>
            </View>
            <View style={styles.vitalItem}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>SpO₂:</Text>{" "}
                {opRecord?.oxygenSaturation || "—"} %
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an official medical record of Jamal Hospitals.
          </Text>
          <Text style={styles.footerText}>
            For inquiries contact: +91-XXX-XXXX or contact@jamalhospitals.com
          </Text>
          <Text style={styles.footerText}>
            Document ID: OP-{opRecord?.id}-{Date.now()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
