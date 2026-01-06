export interface BasePatient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  registrationDate: string;
  bloodGroup?: string;


}
export interface PatientRegistrationProps {
  patients: BasePatient[];
  onRegisterPatient: (patient: Omit<BasePatient, 'id' | 'registrationDate'> extends VitalSigns) => void;
  onSelectExistingPatient: (patient: BasePatient) => void;
}
export interface VitalSigns {
  weight: number;
  height: number;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}
export interface IPRecord {
  id: string;
  patientId: string;
  ipNumber: string;
  visitDate: string;
  visitTime: string;
  reasonForVisit: string;
  chiefComplaint: string;
  currentMedications: string;
  vitalSigns: VitalSigns;
  status: 'Active' | 'Completed' | 'Admitted' | 'Discharged';
  validUntil: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  referredBy?: string;
  department: string;
  assignedDoctor?: string;
}
export interface ConsultationRecord {
  id: string;
  ipRecordId: string;
  doctorName: string;
  consultationDate: string;
  consultationTime: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: string;
  followUpInstructions: string;
  decision: 'Admit' | 'Discharge' | 'Observation' | 'Refer';
  admissionReason?: string;
  dischargeSummary?: string;
  estimatedStayDuration?: string;
}
export interface AdmissionDetails {
  id: string;
  ipRecordId: string;
  patientId: string;
  admissionDate: string;
  admissionTime: string;
  ward: string;
  roomNumber: string;
  bedNumber: string;
  roomType: 'General' | 'Semi-Private' | 'Private' | 'ICU' | 'Emergency';
  assignedNurse?: string;
  dietaryRequirements?: string;
  specialInstructions?: string;
  estimatedDischarge?: string;
  status: 'Active' | 'Discharged';
}
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  cost: number;
  prescribedDate: string;
  prescribedBy: string;
  duration: string;
}
export interface Bill {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  contact: string;
  admissionDate: string;
  department: string;
  doctor: string;
  status: 'Admitted' | 'IP';
  outstandingBill: number;
  medications: Medication[];
  billHistory: Bill[];
}

const ipRecords:IPRecord[] = [
    {
      id: 'IP001',
      patientId: 'P001',
      ipNumber: 'IP123456',
      visitDate: '2024-09-17',
      visitTime: '14:30',
      reasonForVisit: 'Chest pain and shortness of breath',
      chiefComplaint: 'Sharp chest pain radiating to left arm',
      currentMedications: 'Lisinopril 10mg daily',
      vitalSigns: {
        weight: 75.5,
        height: 175,
        temperature: 98.6,
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 90,
        pulse: 88,
        respiratoryRate: 18,
        oxygenSaturation: 98.2
      },
      status: 'Active',
      validUntil: '2024-09-18T14:30:00',
      priority: 'High',
      department: 'Cardiology',
      referredBy: 'Dr. Johnson'
    }
  ]
