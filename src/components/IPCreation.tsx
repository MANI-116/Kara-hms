import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Clock, User, Download } from 'lucide-react';
import { toast } from 'sonner';
import { BasePatient } from "../types/patient";
import { pdf } from "@react-pdf/renderer";
import { IPPDFDocument } from "./IPPDFDocument";

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

interface IPCreationProps {
  selectedPatient: BasePatient | null;
  onCreateIP: (ipRecord: Omit<IPRecord, 'id' | 'ipNumber' | 'status'>) => void;
  onClearSelection: () => void;
}

export function IPCreation({ selectedPatient, onCreateIP, onClearSelection }: IPCreationProps) {
  const [formData, setFormData] = useState({
    reasonForVisit: '',
    chiefComplaint: '',
    currentMedications: '',
    department: '',
    priority: 'Medium',
    referredBy: '',
    weight: '',
    height: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });

  const [generatedIP, setGeneratedIP] = useState<any | null>(null);

  const departments = [
    'Emergency', 'General Medicine', 'Cardiology', 'Neurology',
    'Orthopedics', 'Pediatrics', 'Gynecology', 'Surgery',
    'Dermatology', 'Psychiatry', 'Ophthalmology', 'ENT'
  ];
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedPatient) {
    toast.error('Please select a patient first');
    return;
  }

  const requiredFields = [
    'reasonForVisit', 'chiefComplaint', 'department',
    'weight', 'temperature', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'pulse'
  ];
  for (const field of requiredFields) {
    if (!formData[field as keyof typeof formData]) {
      toast.error('Please fill all required fields');
      return;
    }
  }

  const vitalSigns: VitalSigns = {
    weight: parseFloat(formData.weight),
    height: parseFloat(formData.height) || 0,
    temperature: parseFloat(formData.temperature),
    bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
    bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
    pulse: parseInt(formData.pulse),
    respiratoryRate: parseInt(formData.respiratoryRate) || 0,
    oxygenSaturation: parseFloat(formData.oxygenSaturation) || 0
  };

  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setHours(validUntil.getHours() + 24);

  const ipRecord = {
    patientId: selectedPatient.id,
    visitDate: now.toISOString().split('T')[0],
    visitTime: now.toTimeString().split(' ')[0],
    reasonForVisit: formData.reasonForVisit,
    chiefComplaint: formData.chiefComplaint,
    currentMedications: formData.currentMedications,
    vitalSigns,
    validUntil: validUntil.toISOString(),
    priority: formData.priority as 'Low' | 'Medium' | 'High' | 'Emergency',
    referredBy: formData.referredBy,
    department: formData.department
  };

  // Send to backend first
  onCreateIP(ipRecord);

  // Simulate backend-generated IP number for naming
  const ipNumber = `IP${Date.now().toString().slice(-6)}`;
  const fullRecord = { ...ipRecord, ipNumber };

  // ✅ Auto-generate and download PDF
  try {
    const blob = await pdf(
      <IPPDFDocument ipRecord={fullRecord} selectedPatient={selectedPatient} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IP_${ipNumber}_${selectedPatient.fullName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('IP record created & PDF downloaded');
  } catch (err) {
    console.error('PDF generation failed:', err);
    toast.error('Error generating PDF');
  }

  // Reset form
  setFormData({
    reasonForVisit: '',
    chiefComplaint: '',
    currentMedications: '',
    department: '',
    priority: 'Medium',
    referredBy: '',
    weight: '',
    height: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });
};


  if (!selectedPatient) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Please select a patient to create an IP record
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selected Patient
            </span>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Change Patient
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{selectedPatient.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient ID</p>
              <p className="font-mono">{selectedPatient.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age & Gender</p>
              <p>{selectedPatient.age} years, {selectedPatient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p>{selectedPatient.contact}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p>{selectedPatient.bloodGroup || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Date</p>
              <p>{new Date(selectedPatient.registrationDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Create IP Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Visit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value: any) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="referredBy">Referred By</Label>
                  <Input
                    id="referredBy"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    placeholder="Doctor/Hospital name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Textarea
                  id="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  placeholder="Main symptoms or concerns"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                <Textarea
                  id="reasonForVisit"
                  value={formData.reasonForVisit}
                  onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                  placeholder="Detailed reason for hospital visit"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  placeholder="List current medications and dosages"
                  rows={2}
                />
              </div>
            </div>

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "weight", label: "Weight (kg) *", placeholder: "70.5" },
                  { id: "height", label: "Height (cm)", placeholder: "170" },
                  { id: "temperature", label: "Temperature (°C) *", placeholder: "98.6" },
                  { id: "pulse", label: "Pulse (bpm) *", placeholder: "72" },
                  { id: "bloodPressureSystolic", label: "BP Systolic *", placeholder: "120" },
                  { id: "bloodPressureDiastolic", label: "BP Diastolic *", placeholder: "80" },
                  { id: "respiratoryRate", label: "Respiratory Rate", placeholder: "16" },
                  { id: "oxygenSaturation", label: "O₂ Saturation (%)", placeholder: "98.0" }
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type="number"
                      step="0.1"
                      value={(formData as any)[id]}
                      onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                      placeholder={placeholder}
                      required={label.includes("*")}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Create IP
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>IP valid for 24 hours</span>
              </div>

              {/* Show PDF Download button once IP is generated */}
              {generatedIP && (
                <PDFDownloadLink
                  document={
                    <IPPDFDocument
                      ipRecord={generatedIP}
                      selectedPatient={selectedPatient}
                    />
                  }
                  fileName={`IP_${generatedIP.ipNumber}_${selectedPatient?.fullName.replace(/\s+/g, "_")}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {loading ? "Preparing PDF..." : "Download PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
