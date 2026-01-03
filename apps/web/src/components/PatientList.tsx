import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Pill, X, Plus, FileText, Trash2 } from 'lucide-react';
import { MedicalHistory } from './MedicalHistory';
import { toast } from 'sonner';
import { Patient} from "../types/patient"

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

// interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: 'Male' | 'Female';
//   contact: string;
//   admissionDate: string;
//   department: string;
//   doctor: string;
//   status: 'Admitted' | 'IP';
//   outstandingBill: number;
//   medications: Medication[];
//   billHistory: Bill[];
// }

interface PatientListProps {
  patients: Patient[];
  onUpdatePatient: (id: string, updates: Partial<Patient>) => void;
  onRemovePatient: (patientId: string) => void;
}

export function PatientList({ patients, onUpdatePatient, onRemovePatient }: PatientListProps) {
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [billCategory, setBillCategory] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationCost, setMedicationCost] = useState('');
  const [medicationDuration, setMedicationDuration] = useState('');

  const billCategories = [
    'Accommodation',
    'Medical Services',
    'Diagnostic Tests',
    'Surgery',
    'Medication',
    'Emergency Services',
    'Laboratory',
    'Radiology',
    'Other'
  ];

  const handleAddBill = (patientId: string, currentBill: number, patient: Patient) => {
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }

    if (!billDescription || !billCategory) {
      toast.error('Please fill all bill fields');
      return;
    }

    const newBill: Bill = {
      id: `B${Date.now()}`,
      amount,
      description: billDescription,
      category: billCategory,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    onUpdatePatient(patientId, {
      outstandingBill: currentBill + amount,
      billHistory: [...patient.billHistory, newBill]
    });

    setBillAmount('');
    setBillDescription('');
    setBillCategory('');
    toast.success(`Bill of ${amount} added successfully`);
  };

  const handleAddMedication = (patientId: string, patient: Patient) => {
    if (!medicationName || !medicationDosage || !medicationFrequency || !medicationCost || !medicationDuration) {
      toast.error('Please fill all medication fields');
      return;
    }

    const cost = parseFloat(medicationCost);
    if (isNaN(cost) || cost <= 0) {
      toast.error('Please enter a valid medication cost');
      return;
    }

    const newMedication: Medication = {
      id: `M${Date.now()}`,
      name: medicationName,
      dosage: medicationDosage,
      frequency: medicationFrequency,
      cost,
      prescribedDate: new Date().toISOString().split('T')[0],
      prescribedBy: patient.doctor,
      duration: medicationDuration
    };

    // Add medication cost to patient's bill
    const medicationBill: Bill = {
      id: `B${Date.now() + 1}`,
      amount: cost,
      description: `Medication: ${medicationName}`,
      category: 'Medication',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    onUpdatePatient(patientId, {
      medications: [...patient.medications, newMedication],
      billHistory: [...patient.billHistory, medicationBill],
      outstandingBill: patient.outstandingBill + cost
    });

    setMedicationName('');
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationCost('');
    setMedicationDuration('');
    toast.success(`Medication "${medicationName}" added successfully`);
  };

  const handleClearBill = (patientId: string, patient: Patient) => {
    const updatedBillHistory = patient.billHistory.map(bill => 
      bill.status === 'Pending' ? { ...bill, status: 'Paid' as const } : bill
    );

    onUpdatePatient(patientId, {
      outstandingBill: 0,
      billHistory: updatedBillHistory
    });
    toast.success('All bills cleared successfully');
  };

  const handleRemovePatient = (patientId: string, patientName: string) => {
    onRemovePatient(patientId);
    toast.success(`Patient ${patientName} removed successfully`);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Outstanding Bill</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Medical History</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-mono">{patient.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.contact}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>{patient.age} years</p>
                  <p className="text-sm text-muted-foreground">{patient.gender}</p>
                </div>
              </TableCell>
              <TableCell>{patient.department}</TableCell>
              <TableCell>{patient.doctor}</TableCell>
              <TableCell>
                <Badge variant={patient.status === 'IP' ? 'default' : 'secondary'}>
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={patient.outstandingBill > 0 ? 'text-red-600' : 'text-green-600'}>
                  ${patient.outstandingBill.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {/* Add Bill Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Bill - {patient.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={billAmount}
                            onChange={(e) => setBillAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={billCategory} onValueChange={setBillCategory}>
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
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter bill description..."
                            value={billDescription}
                            onChange={(e) => setBillDescription(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleAddBill(patient.id, patient.outstandingBill, patient)}
                          className="w-full"
                        >
                          Add Bill
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Add Medication Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Pill className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Medication - {patient.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="medication">Medication Name</Label>
                          <Input
                            id="medication"
                            placeholder="Enter medication name"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            placeholder="e.g., 500mg"
                            value={medicationDosage}
                            onChange={(e) => setMedicationDosage(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select value={medicationFrequency} onValueChange={setMedicationFrequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Once Daily">Once Daily</SelectItem>
                              <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                              <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                              <SelectItem value="Four Times Daily">Four Times Daily</SelectItem>
                              <SelectItem value="As Needed">As Needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="cost">Cost ($)</Label>
                          <Input
                            id="cost"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={medicationCost}
                            onChange={(e) => setMedicationCost(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 7 days, 2 weeks"
                            value={medicationDuration}
                            onChange={(e) => setMedicationDuration(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleAddMedication(patient.id, patient)}
                          className="w-full"
                        >
                          Add Medication
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Clear Bill Button */}
                  {patient.outstandingBill > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClearBill(patient.id, patient)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}

                  {/* Remove Patient Button - only show when no outstanding bills */}
                  {patient.outstandingBill === 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Patient</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {patient.name} from the system? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemovePatient(patient.id, patient.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Patient
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <MedicalHistory patient={patient} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {patients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No patients found. Add patients using the registration tabs above.</p>
        </div>
      )}
    </div>
  );
}