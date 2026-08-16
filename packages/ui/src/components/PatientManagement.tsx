import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PatientRegistration } from './PatientRegistration';
import { IPCreation } from './IPCreation';
import { ConsultationManagement } from './ConsultationManagement';
import { AdmissionManagement } from './AdmissionManagement';
import { PatientList } from './PatientList';
import { UserPlus, FileText, Stethoscope, Bed, Users } from 'lucide-react';
import { OPCreation } from './OPCreattion';
import { toast } from 'sonner';
import { BasePatient, IPRecord, Patient,Medication,AdmissionDetails,ConsultationRecord, Bill, VitalSigns} from "../types/patient"
import { useApiClient } from '../../apiContext/ApiProvider';


export function PatientManagement() {
  const [basePatients, setBasePatients] = useState<BasePatient[]>([]);
  const [ipRecords, setIpRecords] = useState<IPRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionDetails[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<BasePatient | null>(null);
  const api=useApiClient();

  // Legacy patients for existing system compatibility
  const [patients, setPatients] = useState<Patient[]>();
useEffect(() => {
    (async () => {
      try {
        const res = await api.getPatients();
        if (res.ok && Array.isArray(res.patients)) {
          setBasePatients(res.patients);
        } else {
          console.warn('Could not load persisted patients', res);
        }
      } catch (err) {
        console.error('Error fetching patients', err);
      }
    })();
  }, []);

  const handleRegisterPatient = async (patientData: Omit<BasePatient, 'id'|'registrationDate'> & VitalSigns) => {
    try {
      // patientData must include registrationDate (YYYY-MM-DD). If frontend didn't send it, backend will set it.
      console.log("sending patient date through ipc for op creation:",patientData);
      const res = await api.registerPatient(patientData);
      if (res.ok && res.patient) {
        setBasePatients(prev => [res.patient, ...prev]);
        toast.success(`Registered: ${res.patient.fullName}`);
      } else {
        toast.error('Registration failed: ' + JSON.stringify(res?.details || res?.message || res?.error));
      }
    } catch (err) {
      console.error('Registration IPC error', err);
      toast.error('Could not register patient');
    }
  };

  const selectExistingPatient = (patient: BasePatient) => {
    setSelectedPatient(patient);
  };

const createIPRecord = async (ipData: any) => {
  if (!selectedPatient) {
    toast.error("Please select a patient from OP first");
    return;
  }

  // Send to backend (it will handle IP ID generation)
  const res = await window?.api.createIP({
    opId: selectedPatient.id,
    ...ipData
  });

  if (res.ok && res.ip) {
    const newIP = {
      ...res.ip,
      id: res.ip.ipId,             // maintain consistency for UI lists
      ipNumber: res.ip.ipNumber || res.ip.ipId,
      status: res.ip.status || 'Active'
    };

    setIpRecords(prev => [newIP, ...prev]);
    toast.success(`IP Created for ${selectedPatient.fullName}`);
    setSelectedPatient(null);
  } else {
    toast.error("Failed to create IP record");
  }
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
    setPatients(patients?.map(patient => 
      patient.id === id ? { ...patient, ...updates } : patient
    ));
  };

  const removePatient = (patientId: string) => {
    setPatients(patients?.filter(patient => patient.id !== patientId));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="op" className="space-y-6">
        <TabsList className="flex w-full flex-row justify-between ">
          
          <TabsTrigger value="op">
            <UserPlus className="mr-2 h-4 w-4" />
            OP
          </TabsTrigger>
          <TabsTrigger value="patients">
            <Users className="mr-2 h-4 w-4" />
            Patient List
          </TabsTrigger>
          {/* <TabsTrigger value="ip-creation">
            <FileText className="mr-2 h-4 w-4" />
            IP
          </TabsTrigger> */
          /* <TabsTrigger value="consultation">
            <Stethoscope className="mr-2 h-4 w-4" />
            Consultation
          </TabsTrigger> */
          /* <TabsTrigger value="admission">
            <Bed className="mr-2 h-4 w-4" />
            Admission
          </TabsTrigger> */
          /* <TabsTrigger value="registration">
            <UserPlus className="mr-2 h-4 w-4" />
            Registration
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="registration">
          <PatientRegistration
            patients={basePatients}
            onRegisterPatient={handleRegisterPatient}
            onSelectExistingPatient={selectExistingPatient}
          />
        </TabsContent>

        <TabsContent value="op">
          <OPCreation />
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

        {/* <TabsContent value="patients">
          <PatientList 
            patients={patients} 
            onUpdatePatient={updatePatient}
            onRemovePatient={removePatient}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

// const registerPatient = (patientData: Omit<BasePatient, 'id' | 'registrationDate'>) => {
  //   const newPatient: BasePatient = {
  //     ...patientData,
  //     id: `P${String(basePatients.length + 1).padStart(3, '0')}`,
  //     registrationDate: new Date().toISOString().split('T')[0]
  //   };
  //   setBasePatients([...basePatients, newPatient]);
  // };

  const basePatients:BasePatient[] =[
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
  ]
  const patients:Patient[] = [
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
  ]

  //  const selectExistingPatient = (patient: BasePatient) => {
  //   setSelectedPatient(patient);
  // };

  // const createIPRecord = (ipData: Omit<IPRecord, 'id' | 'ipNumber' | 'status'>) => {
  //   const newIP: IPRecord = {
  //     ...ipData,
  //     id: `IP${Date.now()}`,
  //     ipNumber: `IP${Date.now().toString().slice(-6)}`,
  //     status: 'Active'
  //   };
  //   setIpRecords([...ipRecords, newIP]);
  //   setSelectedPatient(null); // Clear selection after creating IP
  // };