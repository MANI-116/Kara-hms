import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PatientRegistration } from './PatientRegistration';
import { IPCreation } from './IPCreation';
import { ConsultationManagement } from './ConsultationManagement';
import { AdmissionManagement } from './AdmissionManagement';
import { PatientList } from './PatientList';
import { UserPlus, FileText, Stethoscope, Bed, Users } from 'lucide-react';

interface BasePatient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  emergencyContact: string;
  emergencyRelation: string;
  registrationDate: string;
  bloodGroup?: string;
  allergies?: string;
  chronicConditions?: string;
}

interface VitalSigns {
  weight: number;
  height: number;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

interface IPRecord {
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

interface ConsultationRecord {
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

interface AdmissionDetails {
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  cost: number;
  prescribedDate: string;
  prescribedBy: string;
  duration: string;
}

interface Bill {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface Patient {
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

export function PatientManagement() {
  const [basePatients, setBasePatients] = useState<BasePatient[]>([
    {
      id: 'P001',
      fullName: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '+1234567890',
      address: '123 Main St, City',
      emergencyContact: '+1234567891',
      emergencyRelation: 'Spouse',
      registrationDate: '2024-09-15',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      chronicConditions: 'Hypertension'
    },
    {
      id: 'P002',
      fullName: 'Jane Smith',
      age: 32,
      gender: 'Female',
      contact: '+1234567892',
      address: '456 Oak Ave, City',
      emergencyContact: '+1234567893',
      emergencyRelation: 'Parent',
      registrationDate: '2024-09-16',
      bloodGroup: 'B+',
      allergies: 'None',
      chronicConditions: 'None'
    }
  ]);

  const [ipRecords, setIpRecords] = useState<IPRecord[]>([
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
  ]);

  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionDetails[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<BasePatient | null>(null);

  // Legacy patients for existing system compatibility
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '+1234567890',
      admissionDate: '2024-09-15',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      status: 'Admitted',
      outstandingBill: 2500.00,
      medications: [
        {
          id: 'M001',
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Once Daily',
          cost: 15.50,
          prescribedDate: '2024-09-15',
          prescribedBy: 'Dr. Smith',
          duration: '30 days'
        }
      ],
      billHistory: [
        {
          id: 'B001',
          amount: 1500.00,
          description: 'Room charges for 3 days',
          category: 'Accommodation',
          date: '2024-09-15',
          status: 'Pending'
        }
      ]
    }
  ]);

  const registerPatient = (patientData: Omit<BasePatient, 'id' | 'registrationDate'>) => {
    const newPatient: BasePatient = {
      ...patientData,
      id: `P${String(basePatients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setBasePatients([...basePatients, newPatient]);
  };

  const selectExistingPatient = (patient: BasePatient) => {
    setSelectedPatient(patient);
  };

  const createIPRecord = (ipData: Omit<IPRecord, 'id' | 'ipNumber' | 'status'>) => {
    const newIP: IPRecord = {
      ...ipData,
      id: `IP${Date.now()}`,
      ipNumber: `IP${Date.now().toString().slice(-6)}`,
      status: 'Active'
    };
    setIpRecords([...ipRecords, newIP]);
    setSelectedPatient(null); // Clear selection after creating IP
  };

  const updateIPStatus = (ipId: string, status: IPRecord['status'], doctorName?: string) => {
    setIpRecords(ipRecords.map(ip => 
      ip.id === ipId 
        ? { ...ip, status, assignedDoctor: doctorName || ip.assignedDoctor }
        : ip
    ));
  };

  const createConsultation = (consultation: Omit<ConsultationRecord, 'id'>) => {
    const newConsultation: ConsultationRecord = {
      ...consultation,
      id: `CON${Date.now()}`
    };
    setConsultations([...consultations, newConsultation]);
  };

  const createAdmission = (admission: Omit<AdmissionDetails, 'id'>) => {
    const newAdmission: AdmissionDetails = {
      ...admission,
      id: `ADM${Date.now()}`
    };
    setAdmissions([...admissions, newAdmission]);
  };

  const addMedication = (patientId: string, medication: Omit<Medication, 'id'>) => {
    // Implementation for adding medication to admitted patient
    console.log('Adding medication:', medication, 'to patient:', patientId);
  };

  const addBill = (patientId: string, bill: Omit<Bill, 'id'>) => {
    // Implementation for adding bill to admitted patient
    console.log('Adding bill:', bill, 'to patient:', patientId);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(patients.map(patient => 
      patient.id === id ? { ...patient, ...updates } : patient
    ));
  };

  const removePatient = (patientId: string) => {
    setPatients(patients.filter(patient => patient.id !== patientId));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="registration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="registration">
            <UserPlus className="mr-2 h-4 w-4" />
            Registration
          </TabsTrigger>
          <TabsTrigger value="ip-creation">
            <FileText className="mr-2 h-4 w-4" />
            IP Creation
          </TabsTrigger>
          <TabsTrigger value="consultation">
            <Stethoscope className="mr-2 h-4 w-4" />
            Consultation
          </TabsTrigger>
          <TabsTrigger value="admission">
            <Bed className="mr-2 h-4 w-4" />
            Admission
          </TabsTrigger>
          <TabsTrigger value="patients">
            <Users className="mr-2 h-4 w-4" />
            Patient List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <PatientRegistration
            patients={basePatients}
            onRegisterPatient={registerPatient}
            onSelectExistingPatient={selectExistingPatient}
          />
        </TabsContent>

        <TabsContent value="ip-creation">
          <IPCreation
            selectedPatient={selectedPatient}
            onCreateIP={createIPRecord}
            onClearSelection={clearSelection}
          />
        </TabsContent>

        <TabsContent value="consultation">
          <ConsultationManagement
            ipRecords={ipRecords}
            patients={basePatients}
            onUpdateIPStatus={updateIPStatus}
            onCreateConsultation={createConsultation}
          />
        </TabsContent>

        <TabsContent value="admission">
          <AdmissionManagement
            ipRecords={ipRecords}
            patients={basePatients}
            onCreateAdmission={createAdmission}
            onAddMedication={addMedication}
            onAddBill={addBill}
          />
        </TabsContent>

        <TabsContent value="patients">
          <PatientList 
            patients={patients} 
            onUpdatePatient={updatePatient}
            onRemovePatient={removePatient}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}