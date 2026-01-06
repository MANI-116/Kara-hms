import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Stethoscope, UserCheck, Clock, AlertCircle, CheckCircle, XCircle, Bed } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BasePatient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
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

interface ConsultationManagementProps {
  ipRecords: IPRecord[];
  patients: BasePatient[];
  onUpdateIPStatus: (ipId: string, status: IPRecord['status'], doctorName?: string) => void;
  onCreateConsultation: (consultation: Omit<ConsultationRecord, 'id'>) => void;
}

export function ConsultationManagement({ 
  ipRecords, 
  patients, 
  onUpdateIPStatus, 
  onCreateConsultation 
}: ConsultationManagementProps) {
  const [selectedIP, setSelectedIP] = useState<IPRecord | null>(null);
  const [consultationForm, setConsultationForm] = useState({
    doctorName: '',
    diagnosis: '',
    treatmentPlan: '',
    prescriptions: '',
    followUpInstructions: '',
    decision: '',
    admissionReason: '',
    dischargeSummary: '',
    estimatedStayDuration: ''
  });

  const activeIPs = ipRecords.filter(ip => ip.status === 'Active');
  
  const getPatientDetails = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeStatus = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const hoursRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursRemaining <= 0) return { status: 'Expired', color: 'text-red-600' };
    if (hoursRemaining <= 2) return { status: `${hoursRemaining}h left`, color: 'text-orange-600' };
    return { status: `${hoursRemaining}h left`, color: 'text-green-600' };
  };

  const handleConsultation = (ip: IPRecord) => {
    setSelectedIP(ip);
    setConsultationForm({
      doctorName: '',
      diagnosis: '',
      treatmentPlan: '',
      prescriptions: '',
      followUpInstructions: '',
      decision: '',
      admissionReason: '',
      dischargeSummary: '',
      estimatedStayDuration: ''
    });
  };

  const handleSubmitConsultation = () => {
    if (!selectedIP || !consultationForm.doctorName || !consultationForm.diagnosis || !consultationForm.decision) {
      toast.error('Please fill all required fields');
      return;
    }

    const now = new Date();
    const consultation: Omit<ConsultationRecord, 'id'> = {
      ipRecordId: selectedIP.id,
      doctorName: consultationForm.doctorName,
      consultationDate: now.toISOString().split('T')[0],
      consultationTime: now.toTimeString().split(' ')[0],
      diagnosis: consultationForm.diagnosis,
      treatmentPlan: consultationForm.treatmentPlan,
      prescriptions: consultationForm.prescriptions,
      followUpInstructions: consultationForm.followUpInstructions,
      decision: consultationForm.decision as 'Admit' | 'Discharge' | 'Observation' | 'Refer',
      admissionReason: consultationForm.admissionReason,
      dischargeSummary: consultationForm.dischargeSummary,
      estimatedStayDuration: consultationForm.estimatedStayDuration
    };

    onCreateConsultation(consultation);

    // Update IP status based on decision
    let newStatus: IPRecord['status'];
    switch (consultationForm.decision) {
      case 'Admit':
        newStatus = 'Admitted';
        break;
      case 'Discharge':
        newStatus = 'Discharged';
        break;
      default:
        newStatus = 'Completed';
    }

    onUpdateIPStatus(selectedIP.id, newStatus, consultationForm.doctorName);
    setSelectedIP(null);
    toast.success(`Consultation completed - Patient ${consultationForm.decision.toLowerCase()}ed`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Active Consultations ({activeIPs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeIPs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Vitals</TableHead>
                  <TableHead>Time Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeIPs.map((ip) => {
                  const patient = getPatientDetails(ip.patientId);
                  const timeStatus = getTimeStatus(ip.validUntil);
                  
                  return (
                    <TableRow key={ip.id}>
                      <TableCell>
                        <div className="font-mono">{ip.ipNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {ip.visitDate} {ip.visitTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{patient?.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient?.age}y, {patient?.gender}
                        </div>
                      </TableCell>
                      <TableCell>{ip.department}</TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(ip.priority)} text-white`}>
                          {ip.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={ip.chiefComplaint}>
                          {ip.chiefComplaint}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>BP: {ip.vitalSigns.bloodPressureSystolic}/{ip.vitalSigns.bloodPressureDiastolic}</div>
                          <div>Temp: {ip.vitalSigns.temperature}°C</div>
                          <div>Pulse: {ip.vitalSigns.pulse}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${timeStatus.color}`}>
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">{timeStatus.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleConsultation(ip)}
                          className="flex items-center gap-1"
                        >
                          <UserCheck className="h-3 w-3" />
                          Consult
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active consultations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultation Dialog */}
      {selectedIP && (
        <Dialog open={!!selectedIP} onOpenChange={() => setSelectedIP(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Consultation - {getPatientDetails(selectedIP.patientId)?.fullName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Patient Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">IP Number</p>
                      <p className="font-mono">{selectedIP.ipNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p>{selectedIP.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Badge className={`${getPriorityColor(selectedIP.priority)} text-white`}>
                        {selectedIP.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p>{getPatientDetails(selectedIP.patientId)?.bloodGroup || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Chief Complaint</p>
                      <p>{selectedIP.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reason for Visit</p>
                      <p>{selectedIP.reasonForVisit}</p>
                    </div>
                    {selectedIP.currentMedications && (
                      <div>
                        <p className="text-sm text-muted-foreground">Current Medications</p>
                        <p>{selectedIP.currentMedications}</p>
                      </div>
                    )}
                  </div>

                  {/* Vital Signs */}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Vital Signs</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>Weight: {selectedIP.vitalSigns.weight} kg</div>
                      <div>Height: {selectedIP.vitalSigns.height} cm</div>
                      <div>Temperature: {selectedIP.vitalSigns.temperature}°C</div>
                      <div>BP: {selectedIP.vitalSigns.bloodPressureSystolic}/{selectedIP.vitalSigns.bloodPressureDiastolic}</div>
                      <div>Pulse: {selectedIP.vitalSigns.pulse} bpm</div>
                      <div>Resp Rate: {selectedIP.vitalSigns.respiratoryRate}/min</div>
                      <div>O2 Sat: {selectedIP.vitalSigns.oxygenSaturation}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultation Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctorName">Doctor Name *</Label>
                      <Input
                        id="doctorName"
                        value={consultationForm.doctorName}
                        onChange={(e) => setConsultationForm({ ...consultationForm, doctorName: e.target.value })}
                        placeholder="Dr. Smith"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="decision">Decision *</Label>
                      <Select 
                        value={consultationForm.decision} 
                        onValueChange={(value) => setConsultationForm({ ...consultationForm, decision: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admit">Admit Patient</SelectItem>
                          <SelectItem value="Discharge">Discharge Patient</SelectItem>
                          <SelectItem value="Observation">Keep for Observation</SelectItem>
                          <SelectItem value="Refer">Refer to Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                    <Textarea
                      id="diagnosis"
                      value={consultationForm.diagnosis}
                      onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                      placeholder="Primary and secondary diagnosis"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                    <Textarea
                      id="treatmentPlan"
                      value={consultationForm.treatmentPlan}
                      onChange={(e) => setConsultationForm({ ...consultationForm, treatmentPlan: e.target.value })}
                      placeholder="Detailed treatment plan"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prescriptions">Prescriptions</Label>
                    <Textarea
                      id="prescriptions"
                      value={consultationForm.prescriptions}
                      onChange={(e) => setConsultationForm({ ...consultationForm, prescriptions: e.target.value })}
                      placeholder="Medications to be prescribed"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
                    <Textarea
                      id="followUpInstructions"
                      value={consultationForm.followUpInstructions}
                      onChange={(e) => setConsultationForm({ ...consultationForm, followUpInstructions: e.target.value })}
                      placeholder="Instructions for patient follow-up"
                      rows={2}
                    />
                  </div>

                  {/* Conditional fields based on decision */}
                  {consultationForm.decision === 'Admit' && (
                    <>
                      <div>
                        <Label htmlFor="admissionReason">Admission Reason</Label>
                        <Textarea
                          id="admissionReason"
                          value={consultationForm.admissionReason}
                          onChange={(e) => setConsultationForm({ ...consultationForm, admissionReason: e.target.value })}
                          placeholder="Reason for admission"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedStayDuration">Estimated Stay Duration</Label>
                        <Input
                          id="estimatedStayDuration"
                          value={consultationForm.estimatedStayDuration}
                          onChange={(e) => setConsultationForm({ ...consultationForm, estimatedStayDuration: e.target.value })}
                          placeholder="e.g., 3-5 days"
                        />
                      </div>
                    </>
                  )}

                  {consultationForm.decision === 'Discharge' && (
                    <div>
                      <Label htmlFor="dischargeSummary">Discharge Summary</Label>
                      <Textarea
                        id="dischargeSummary"
                        value={consultationForm.dischargeSummary}
                        onChange={(e) => setConsultationForm({ ...consultationForm, dischargeSummary: e.target.value })}
                        placeholder="Summary for discharge"
                        rows={2}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSubmitConsultation} className="flex items-center gap-2">
                      {consultationForm.decision === 'Admit' ? (
                        <Bed className="h-4 w-4" />
                      ) : consultationForm.decision === 'Discharge' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                      Complete Consultation
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedIP(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}