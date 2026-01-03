import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Bed, MapPin, UserPlus, Calendar, Pill, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BasePatient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  bloodGroup?: string;
}

interface IPRecord {
  id: string;
  patientId: string;
  ipNumber: string;
  visitDate: string;
  department: string;
  status: 'Active' | 'Completed' | 'Admitted' | 'Discharged';
  assignedDoctor?: string;
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

interface AdmittedPatient extends AdmissionDetails {
  patient: BasePatient;
  ipRecord: IPRecord;
  medications: Medication[];
  billHistory: Bill[];
  outstandingBill: number;
}

interface AdmissionManagementProps {
  ipRecords: IPRecord[];
  patients: BasePatient[];
  onCreateAdmission: (admission: Omit<AdmissionDetails, 'id'>) => void;
  onAddMedication: (patientId: string, medication: Omit<Medication, 'id'>) => void;
  onAddBill: (patientId: string, bill: Omit<Bill, 'id'>) => void;
}

export function AdmissionManagement({ 
  ipRecords, 
  patients, 
  onCreateAdmission,
  onAddMedication,
  onAddBill
}: AdmissionManagementProps) {
  const [selectedIP, setSelectedIP] = useState<IPRecord | null>(null);
  const [admissionForm, setAdmissionForm] = useState({
    ward: '',
    roomNumber: '',
    bedNumber: '',
    roomType: 'General',
    assignedNurse: '',
    dietaryRequirements: '',
    specialInstructions: '',
    estimatedDischarge: ''
  });

  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    cost: '',
    duration: ''
  });

  const [billForm, setBillForm] = useState({
    amount: '',
    description: '',
    category: ''
  });

  const [selectedPatientForMeds, setSelectedPatientForMeds] = useState<string | null>(null);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showBillDialog, setShowBillDialog] = useState(false);

  // Get IPs that need admission
  const pendingAdmissions = ipRecords.filter(ip => ip.status === 'Admitted' && !ip.assignedDoctor);
  
  // Mock admitted patients data (in real app, this would come from props)
  const admittedPatients: AdmittedPatient[] = [
    {
      id: 'ADM001',
      ipRecordId: 'IP001',
      patientId: 'P001',
      admissionDate: '2024-09-17',
      admissionTime: '14:30',
      ward: 'Cardiology Ward',
      roomNumber: '301',
      bedNumber: 'A',
      roomType: 'Semi-Private',
      assignedNurse: 'Nurse Johnson',
      status: 'Active',
      patient: patients[0] || {
        id: 'P001',
        fullName: 'John Doe',
        age: 45,
        gender: 'Male',
        contact: '+1234567890',
        bloodGroup: 'A+'
      },
      ipRecord: {
        id: 'IP001',
        patientId: 'P001',
        ipNumber: 'IP123456',
        visitDate: '2024-09-17',
        department: 'Cardiology',
        status: 'Admitted',
        assignedDoctor: 'Dr. Smith'
      },
      medications: [],
      billHistory: [],
      outstandingBill: 2500
    }
  ];

  const wards = [
    'General Medicine Ward',
    'Cardiology Ward',
    'Neurology Ward',
    'Orthopedics Ward',
    'Pediatrics Ward',
    'Maternity Ward',
    'Surgery Ward',
    'ICU',
    'Emergency Ward'
  ];

  const medicationFrequencies = [
    'Once Daily',
    'Twice Daily',
    'Three Times Daily',
    'Four Times Daily',
    'Every 6 Hours',
    'Every 8 Hours',
    'As Needed',
    'Before Meals',
    'After Meals'
  ];

  const billCategories = [
    'Room Charges',
    'Medical Services',
    'Diagnostic Tests',
    'Surgery',
    'Medication',
    'Laboratory',
    'Radiology',
    'Nursing Care',
    'Other'
  ];

  const getPatientDetails = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const handleAdmission = (ip: IPRecord) => {
    setSelectedIP(ip);
    setAdmissionForm({
      ward: '',
      roomNumber: '',
      bedNumber: '',
      roomType: 'General',
      assignedNurse: '',
      dietaryRequirements: '',
      specialInstructions: '',
      estimatedDischarge: ''
    });
  };

  const handleSubmitAdmission = () => {
    if (!selectedIP || !admissionForm.ward || !admissionForm.roomNumber || !admissionForm.bedNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    const now = new Date();
    const admission: Omit<AdmissionDetails, 'id'> = {
      ipRecordId: selectedIP.id,
      patientId: selectedIP.patientId,
      admissionDate: now.toISOString().split('T')[0],
      admissionTime: now.toTimeString().split(' ')[0],
      ward: admissionForm.ward,
      roomNumber: admissionForm.roomNumber,
      bedNumber: admissionForm.bedNumber,
      roomType: admissionForm.roomType as AdmissionDetails['roomType'],
      assignedNurse: admissionForm.assignedNurse,
      dietaryRequirements: admissionForm.dietaryRequirements,
      specialInstructions: admissionForm.specialInstructions,
      estimatedDischarge: admissionForm.estimatedDischarge,
      status: 'Active'
    };

    onCreateAdmission(admission);
    setSelectedIP(null);
    toast.success('Patient admitted successfully');
  };

  const handleAddMedication = () => {
    if (!medicationForm.name || !medicationForm.dosage || !medicationForm.frequency || !medicationForm.cost) {
      toast.error('Please fill all required medication fields');
      return;
    }

    const cost = parseFloat(medicationForm.cost);
    if (isNaN(cost) || cost <= 0) {
      toast.error('Please enter a valid medication cost');
      return;
    }

    const medication: Omit<Medication, 'id'> = {
      name: medicationForm.name,
      dosage: medicationForm.dosage,
      frequency: medicationForm.frequency,
      cost,
      prescribedDate: new Date().toISOString().split('T')[0],
      prescribedBy: 'Dr. Smith', // Would come from consultation
      duration: medicationForm.duration
    };

    if (selectedPatientForMeds) {
      onAddMedication(selectedPatientForMeds, medication);
      
      // Also add as bill
      const medicationBill: Omit<Bill, 'id'> = {
        amount: cost,
        description: `Medication: ${medication.name}`,
        category: 'Medication',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      onAddBill(selectedPatientForMeds, medicationBill);
    }

    setMedicationForm({
      name: '',
      dosage: '',
      frequency: '',
      cost: '',
      duration: ''
    });
    setShowMedicationDialog(false);
    setSelectedPatientForMeds(null);
    toast.success('Medication added successfully');
  };

  const handleAddBill = () => {
    if (!billForm.amount || !billForm.description || !billForm.category) {
      toast.error('Please fill all bill fields');
      return;
    }

    const amount = parseFloat(billForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }

    const bill: Omit<Bill, 'id'> = {
      amount,
      description: billForm.description,
      category: billForm.category,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    if (selectedPatientForMeds) {
      onAddBill(selectedPatientForMeds, bill);
    }

    setBillForm({
      amount: '',
      description: '',
      category: ''
    });
    setShowBillDialog(false);
    setSelectedPatientForMeds(null);
    toast.success('Bill added successfully');
  };

  return (
    <div className="space-y-6">
      {/* Pending Admissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Pending Admissions ({pendingAdmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAdmissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAdmissions.map((ip) => {
                  const patient = getPatientDetails(ip.patientId);
                  return (
                    <TableRow key={ip.id}>
                      <TableCell className="font-mono">{ip.ipNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium">{patient?.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient?.age}y, {patient?.gender}
                        </div>
                      </TableCell>
                      <TableCell>{ip.department}</TableCell>
                      <TableCell>{ip.visitDate}</TableCell>
                      <TableCell>{ip.assignedDoctor || 'Not assigned'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleAdmission(ip)}
                          className="flex items-center gap-1"
                        >
                          <Bed className="h-3 w-3" />
                          Admit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending admissions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admitted Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Currently Admitted Patients ({admittedPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {admittedPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Room Details</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Assigned Nurse</TableHead>
                  <TableHead>Outstanding Bill</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admittedPatients.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell>
                      <div className="font-medium">{admission.patient.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        IP: {admission.ipRecord.ipNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{admission.ward}</div>
                        <div>Room {admission.roomNumber}, Bed {admission.bedNumber}</div>
                        <Badge variant="outline" className="mt-1">
                          {admission.roomType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{admission.admissionDate}</div>
                      <div className="text-sm text-muted-foreground">{admission.admissionTime}</div>
                    </TableCell>
                    <TableCell>{admission.assignedNurse || 'Not assigned'}</TableCell>
                    <TableCell>
                      <div className="font-medium text-red-600">
                        ${admission.outstandingBill.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPatientForMeds(admission.patientId);
                            setShowMedicationDialog(true);
                          }}
                        >
                          <Pill className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPatientForMeds(admission.patientId);
                            setShowBillDialog(true);
                          }}
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bed className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients currently admitted</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admission Dialog */}
      {selectedIP && (
        <Dialog open={!!selectedIP} onOpenChange={() => setSelectedIP(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Admit Patient - {getPatientDetails(selectedIP.patientId)?.fullName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ward">Ward *</Label>
                  <Select value={admissionForm.ward} onValueChange={(value) => setAdmissionForm({ ...admissionForm, ward: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select value={admissionForm.roomType} onValueChange={(value) => setAdmissionForm({ ...admissionForm, roomType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Semi-Private">Semi-Private</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roomNumber">Room Number *</Label>
                  <Input
                    id="roomNumber"
                    value={admissionForm.roomNumber}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, roomNumber: e.target.value })}
                    placeholder="301"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bedNumber">Bed Number *</Label>
                  <Input
                    id="bedNumber"
                    value={admissionForm.bedNumber}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, bedNumber: e.target.value })}
                    placeholder="A"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="assignedNurse">Assigned Nurse</Label>
                  <Input
                    id="assignedNurse"
                    value={admissionForm.assignedNurse}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, assignedNurse: e.target.value })}
                    placeholder="Nurse Johnson"
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedDischarge">Estimated Discharge</Label>
                  <Input
                    id="estimatedDischarge"
                    type="date"
                    value={admissionForm.estimatedDischarge}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, estimatedDischarge: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                <Textarea
                  id="dietaryRequirements"
                  value={admissionForm.dietaryRequirements}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, dietaryRequirements: e.target.value })}
                  placeholder="Any special dietary needs"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={admissionForm.specialInstructions}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, specialInstructions: e.target.value })}
                  placeholder="Any special care instructions"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmitAdmission} className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Admit Patient
                </Button>
                <Button variant="outline" onClick={() => setSelectedIP(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Medication Dialog */}
      <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="medName">Medication Name *</Label>
              <Input
                id="medName"
                value={medicationForm.name}
                onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                placeholder="Aspirin"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={medicationForm.dosage}
                  onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                  placeholder="100mg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={medicationForm.frequency} onValueChange={(value) => setMedicationForm({ ...medicationForm, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationFrequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Cost ($) *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={medicationForm.cost}
                  onChange={(e) => setMedicationForm({ ...medicationForm, cost: e.target.value })}
                  placeholder="25.50"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={medicationForm.duration}
                  onChange={(e) => setMedicationForm({ ...medicationForm, duration: e.target.value })}
                  placeholder="7 days"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddMedication}>Add Medication</Button>
              <Button variant="outline" onClick={() => setShowMedicationDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Dialog */}
      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="billAmount">Amount ($) *</Label>
              <Input
                id="billAmount"
                type="number"
                step="0.01"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                placeholder="150.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="billCategory">Category *</Label>
              <Select value={billForm.category} onValueChange={(value) => setBillForm({ ...billForm, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {billCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="billDescription">Description *</Label>
              <Textarea
                id="billDescription"
                value={billForm.description}
                onChange={(e) => setBillForm({ ...billForm, description: e.target.value })}
                placeholder="Description of the bill"
                rows={2}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddBill}>Add Bill</Button>
              <Button variant="outline" onClick={() => setShowBillDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}