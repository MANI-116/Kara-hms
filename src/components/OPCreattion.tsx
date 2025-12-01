import { useState,  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { UserPlus, Search, Divide } from 'lucide-react';
import { toast } from 'sonner';
import {BasePatient, PatientRegistrationProps } from "../types/patient"
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { JamalOP } from './JamalOP';
export function OPCreation({ patients, onRegisterPatient, onSelectExistingPatient }: PatientRegistrationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    bloodGroup: '',
    weight:'',
    height:'',
    temperature:'',
    pulse:'',
    bloodPressureSystolic:'',
    bloodPressureDiastolic:'',
    respiratoryRate:'',
    oxygenSaturation:''
    
  });


  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.age || !formData.gender || !formData.contact) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if patient already exists
    

    onRegisterPatient({...formData,age:parseInt(formData.age)});

    // Reset form
    setFormData({
         fullName: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    bloodGroup: '',
    weight:'',
    height:'',
    temperature:'',
    pulse:'',
    bloodPressureSystolic:'',
    bloodPressureDiastolic:'',
    respiratoryRate:'',
    oxygenSaturation:''
    });
    setIsNewPatient(false);
    toast.success('Patient registered successfully');
  };

  const handleSelectPatient = (patient: BasePatient) => {
    onSelectExistingPatient(patient);
    setSearchTerm('');
    toast.success(`Selected patient: ${patient.fullName}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Existing Patients */}
      <Tabs>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jamal-op">
            jamal op
          </TabsTrigger>
          <TabsTrigger value="jims-op">
            jimsop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jamal-op">
             <JamalOP
                      patients={[]}
                      onRegisterPatient={()=>{}}
                      onSelectExistingPatient={()=>{}}
                    />
        </TabsContent>
        <TabsContent value="jims-op">
          JimsOP
        </TabsContent>
      </Tabs>
         </div>
  );
}


// function OP = ()=>{
//   return (<div>
//     <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Search className="h-5 w-5" />
//             Search Existing Patients
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="search">Search by Name or Patient ID</Label>
//             <Input
//               id="search"
//               placeholder="Enter patient name or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {searchTerm && (
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {filteredPatients.length > 0 ? (
//                 filteredPatients.map((patient) => (
//                   <div
//                     key={patient.id}
//                     className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
//                     onClick={() => handleSelectPatient(patient)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium">{patient.fullName}</p>
//                         <p className="text-sm text-muted-foreground">
//                           ID: {patient.id} • {patient.age} years • {patient.gender}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Contact: {patient.contact}
//                         </p>
//                       </div>
//                       <Button size="sm" variant="outline">
//                         Select
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <p>No patients found</p>
//                   <Button
//                     variant="link"
//                     onClick={() => setIsNewPatient(true)}
//                     className="mt-2"
//                   >
//                     Register as new patient
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}

//           {!isNewPatient && (
//             <div className="flex justify-center pt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsNewPatient(true)}
//                 className="flex items-center gap-2"
//               >
//                 <UserPlus className="h-4 w-4" />
//                 Register New Patient
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* New Patient Registration */}
//       {isNewPatient && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <UserPlus className="h-5 w-5" />
//               Register New Patient
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="date">
//                 <Label>Date:{new Intl.DateTimeFormat("en-US").format(Date.now())}</Label>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 <div>
//                   <Label htmlFor="fullName">Full Name *</Label>
//                   <Input
//                     id="fullName"
//                     value={formData.fullName}
//                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                     placeholder="Enter full name"
//                     required
//                   />
//                 </div>


//                 <div>
//                   <Label htmlFor="age">Age *</Label>
//                   <Input
//                     id="age"
//                     type="number"
//                     value={formData.age}
//                     onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//                     placeholder="Enter age"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="gender">Gender *</Label>
//                   <Select value={formData.gender} onValueChange={(value:string) => setFormData({ ...formData, gender: value })}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select gender" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Male">Male</SelectItem>
//                       <SelectItem value="Female">Female</SelectItem>
//                       <SelectItem value="Other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="contact">Contact Number *</Label>
//                   <Input
//                     id="contact"
//                     value={formData.contact}
//                     onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//                     placeholder="Enter contact number"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="bloodGroup">Blood Group</Label>
//                   <Select value={formData.bloodGroup} onValueChange={(value:string) => setFormData({ ...formData, bloodGroup: value })}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select blood group" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="A+">A+</SelectItem>
//                       <SelectItem value="A-">A-</SelectItem>
//                       <SelectItem value="B+">B+</SelectItem>
//                       <SelectItem value="B-">B-</SelectItem>
//                       <SelectItem value="AB+">AB+</SelectItem>
//                       <SelectItem value="AB-">AB-</SelectItem>
//                       <SelectItem value="O+">O+</SelectItem>
//                       <SelectItem value="O-">O-</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
                

//                 {/* <div>
//                   <Label htmlFor="emergencyContact">Emergency Contact</Label>
//                   <Input
//                     id="emergencyContact"
//                     value={formData.emergencyContact}
//                     onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
//                     placeholder="Emergency contact number"
//                   />
//                 </div> */}

//                 {/* <div>
//                   <Label htmlFor="emergencyRelation">Emergency Contact Relation</Label>
//                   <Input
//                     id="emergencyRelation"
//                     value={formData.emergencyRelation}
//                     onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
//                     placeholder="Relationship"
//                   />
//                 </div> */}
//               </div>

//               <div>
//                 <Label htmlFor="address">Address</Label>
//                 <Textarea
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   placeholder="Enter full address"
//                   rows={2}
//                 />
//               </div>
//               <div className="space-y-4">
//               <h3 className="font-medium text-lg">Vital Signs</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { id: "weight", label: "Weight (kg) *", placeholder: "70.5" },
//                   { id: "height", label: "Height (cm)", placeholder: "170" },
//                   { id: "temperature", label: "Temperature (°C) *", placeholder: "98.6" },
//                   { id: "pulse", label: "Pulse (bpm) *", placeholder: "72" },
//                   { id: "bloodPressureSystolic", label: "BP Systolic *", placeholder: "120" },
//                   { id: "bloodPressureDiastolic", label: "BP Diastolic *", placeholder: "80" },
//                   { id: "respiratoryRate", label: "Respiratory Rate", placeholder: "16" },
//                   { id: "oxygenSaturation", label: "O₂ Saturation (%)", placeholder: "98.0" }
//                 ].map(({ id, label, placeholder }) => (
//                   <div key={id}>
//                     <Label htmlFor={id}>{label}</Label>
//                     <Input
//                       id={id}
//                       type="number"
//                       step="0.1"
//                       value={(formData as any)[id]}
//                       onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
//                       placeholder={placeholder}
                      
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//               {/* <div>
//                 <Label htmlFor="allergies">Known Allergies</Label>
//                 <Textarea
//                   id="allergies"
//                   value={formData.allergies}
//                   onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
//                   placeholder="List any known allergies"
//                   rows={2}
//                 />
//               </div> */}

//               {/* <div>
//                 <Label htmlFor="chronicConditions">Chronic Conditions</Label>
//                 <Textarea
//                   id="chronicConditions"
//                   value={formData.chronicConditions}
//                   onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
//                   placeholder="List any chronic medical conditions"
//                   rows={2}
//                 />
//               </div> */}

//               <div className="flex gap-3 pt-4">
//                 <Button type="submit" className="flex-1">
//                   Register Patient
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsNewPatient(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}
//  </div>)
// }