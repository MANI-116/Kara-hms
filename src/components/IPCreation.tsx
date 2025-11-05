import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { FileText, Download, Clock, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
  weight: number; // kg
  height: number; // cm
  temperature: number; // °C
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number; // bpm
  respiratoryRate: number; // per minute
  oxygenSaturation: number; // %
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
  validUntil: string; // Date when IP expires
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
    // Vital Signs
    weight: '',
    height: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });

  const departments = [
    'Emergency',
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Surgery',
    'Dermatology',
    'Psychiatry',
    'Ophthalmology',
    'ENT'
  ];

  const generatePDF = (ipRecord: any) => {
    // In a real application, this would generate a proper PDF
    // For now, we'll create a simple text representation
    const pdfContent = `
IP FORM - MEDICARE HOSPITAL
================================

Patient Information:
- Name: ${selectedPatient?.fullName}
- Patient ID: ${selectedPatient?.id}
- Age: ${selectedPatient?.age} years
- Gender: ${selectedPatient?.gender}
- Blood Group: ${selectedPatient?.bloodGroup || 'Not specified'}
- Contact: ${selectedPatient?.contact}

IP Details:
- IP Number: ${ipRecord.ipNumber}
- Visit Date: ${ipRecord.visitDate}
- Visit Time: ${ipRecord.visitTime}
- Department: ${ipRecord.department}
- Priority: ${ipRecord.priority}
- Valid Until: ${ipRecord.validUntil}

Chief Complaint:
${ipRecord.chiefComplaint}

Reason for Visit:
${ipRecord.reasonForVisit}

Vital Signs:
- Weight: ${ipRecord.vitalSigns.weight} kg
- Height: ${ipRecord.vitalSigns.height} cm
- Temperature: ${ipRecord.vitalSigns.temperature}°C
- Blood Pressure: ${ipRecord.vitalSigns.bloodPressureSystolic}/${ipRecord.vitalSigns.bloodPressureDiastolic} mmHg
- Pulse: ${ipRecord.vitalSigns.pulse} bpm
- Respiratory Rate: ${ipRecord.vitalSigns.respiratoryRate}/min
- Oxygen Saturation: ${ipRecord.vitalSigns.oxygenSaturation}%

Current Medications:
${ipRecord.currentMedications || 'None reported'}

Allergies:
${selectedPatient?.allergies || 'None reported'}

Chronic Conditions:
${selectedPatient?.chronicConditions || 'None reported'}

Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download the "PDF" (as text file for demo)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IP_${ipRecord.ipNumber}_${selectedPatient?.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error('Please select a patient first');
      return;
    }

    // Validate required fields
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
    validUntil.setHours(validUntil.getHours() + 24); // Valid for 24 hours

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

    onCreateIP(ipRecord);

    // Generate IP number for PDF (this would be done in the parent component in real app)
    const mockIPRecord = {
      ...ipRecord,
      ipNumber: `IP${Date.now().toString().slice(-6)}`
    };

    // Generate and download PDF
    generatePDF(mockIPRecord);

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

    toast.success('IP record created and downloaded successfully');
  };

  if (!selectedPatient) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please select a patient to create an IP record</p>
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
            <FileText className="h-5 w-5" />
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
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="170"
                  />
                </div>

                <div>
                  <Label htmlFor="temperature">Temperature (°C) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="98.6"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pulse">Pulse (bpm) *</Label>
                  <Input
                    id="pulse"
                    type="number"
                    value={formData.pulse}
                    onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                    placeholder="72"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bloodPressureSystolic">BP Systolic *</Label>
                  <Input
                    id="bloodPressureSystolic"
                    type="number"
                    value={formData.bloodPressureSystolic}
                    onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                    placeholder="120"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bloodPressureDiastolic">BP Diastolic *</Label>
                  <Input
                    id="bloodPressureDiastolic"
                    type="number"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                    placeholder="80"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                    placeholder="16"
                  />
                </div>

                <div>
                  <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    step="0.1"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    placeholder="98.0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Create IP & Download PDF
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>IP valid for 24 hours</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}