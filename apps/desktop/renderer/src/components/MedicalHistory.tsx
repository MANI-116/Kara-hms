import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Pill, DollarSign, Calendar } from 'lucide-react';

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

interface MedicalHistoryProps {
  patient: Patient;
}

export function MedicalHistory({ patient }: MedicalHistoryProps) {
  const totalMedicationCost = patient.medications.reduce((sum, med) => sum + med.cost, 0);
  const totalBillAmount = patient.billHistory.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = patient.billHistory.filter(bill => bill.status === 'Paid');
  const pendingBills = patient.billHistory.filter(bill => bill.status === 'Pending');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical History - {patient.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Patient Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-mono">{patient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{patient.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                  <p>{patient.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p>{new Date(patient.admissionDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Medication Costs</p>
                    <p className="text-lg font-semibold">${totalMedicationCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Billed</p>
                    <p className="text-lg font-semibold">${totalBillAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-lg font-semibold">${patient.outstandingBill.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="medications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="medications">
                <Pill className="mr-2 h-4 w-4" />
                Medications ({patient.medications.length})
              </TabsTrigger>
              <TabsTrigger value="bills">
                <DollarSign className="mr-2 h-4 w-4" />
                Bill History ({patient.billHistory.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle>Prescribed Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Prescribed By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patient.medications.map((medication) => (
                          <TableRow key={medication.id}>
                            <TableCell className="font-medium">{medication.name}</TableCell>
                            <TableCell>{medication.dosage}</TableCell>
                            <TableCell>{medication.frequency}</TableCell>
                            <TableCell>{medication.duration}</TableCell>
                            <TableCell>{medication.prescribedBy}</TableCell>
                            <TableCell>
                              {new Date(medication.prescribedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-green-600">
                              ${medication.cost.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No medications prescribed yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bills">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.billHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Paid Bills</p>
                          <p className="text-lg font-semibold text-green-600">{paidBills.length}</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Pending Bills</p>
                          <p className="text-lg font-semibold text-yellow-600">{pendingBills.length}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Bills</p>
                          <p className="text-lg font-semibold text-blue-600">{patient.billHistory.length}</p>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patient.billHistory
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((bill) => (
                              <TableRow key={bill.id}>
                                <TableCell>
                                  {new Date(bill.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{bill.description}</TableCell>
                                <TableCell>{bill.category}</TableCell>
                                <TableCell className="font-medium">
                                  ${bill.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      bill.status === 'Paid' ? 'default' : 
                                      bill.status === 'Pending' ? 'secondary' : 'destructive'
                                    }
                                  >
                                    {bill.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No billing history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}