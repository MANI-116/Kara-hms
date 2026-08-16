import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface Patient {
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  contact: string;
  admissionDate: string;
  department: string;
  doctor: string;
  status: 'Admitted' | 'IP';
  outstandingBill: number;
}

interface CreateIPProps {
  onAddPatient: (patient: Patient) => void;
}

export function CreateIP({ onAddPatient }: CreateIPProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as 'Male' | 'Female' | '',
    contact: '',
    address: '',
    emergencyContact: '',
    department: '',
    doctor: '',
    roomNumber: '',
    bedNumber: '',
    admissionReason: '',
    medicalHistory: '',
    insuranceInfo: ''
  });

  const departments = [
    'ICU',
    'CCU',
    'General Ward',
    'Private Room',
    'Surgery',
    'Maternity',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Cardiology'
  ];

  const doctors = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Brown',
    'Dr. Williams',
    'Dr. Davis',
    'Dr. Miller',
    'Dr. Wilson',
    'Dr. Moore',
    'Dr. Taylor',
    'Dr. Anderson'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || !formData.contact || 
        !formData.department || !formData.doctor || !formData.roomNumber || !formData.bedNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    const patient: Patient = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      contact: formData.contact,
      admissionDate: new Date().toISOString().split('T')[0],
      department: formData.department,
      doctor: formData.doctor,
      status: 'IP',
      outstandingBill: 0
    };

    onAddPatient(patient);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      gender: '' as 'Male' | 'Female' | '',
      contact: '',
      address: '',
      emergencyContact: '',
      department: '',
      doctor: '',
      roomNumber: '',
      bedNumber: '',
      admissionReason: '',
      medicalHistory: '',
      insuranceInfo: ''
    });

    toast.success(`IP created successfully for ${patient.name} - Room ${formData.roomNumber}, Bed ${formData.bedNumber}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="150"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>

            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="department">Ward/Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward/department" />
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
              <Label htmlFor="doctor">Assigned Doctor *</Label>
              <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room">Room Number *</Label>
              <Input
                id="room"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                placeholder="e.g., 101"
                required
              />
            </div>

            <div>
              <Label htmlFor="bed">Bed Number *</Label>
              <Input
                id="bed"
                value={formData.bedNumber}
                onChange={(e) => handleInputChange('bedNumber', e.target.value)}
                placeholder="e.g., A1"
                required
              />
            </div>

            <div>
              <Label htmlFor="insurance">Insurance Information</Label>
              <Input
                id="insurance"
                value={formData.insuranceInfo}
                onChange={(e) => handleInputChange('insuranceInfo', e.target.value)}
                placeholder="Insurance provider and policy number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter patient's address"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="reason">Admission Reason</Label>
            <Textarea
              id="reason"
              value={formData.admissionReason}
              onChange={(e) => handleInputChange('admissionReason', e.target.value)}
              placeholder="Enter reason for IP admission"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="history">Medical History</Label>
            <Textarea
              id="history"
              value={formData.medicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
              placeholder="Enter relevant medical history"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Inpatient (IP)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}