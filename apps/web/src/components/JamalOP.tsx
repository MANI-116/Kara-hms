import { ChangeEvent, useState,  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { pdf } from "@react-pdf/renderer"
import { OPPDFDocument} from "./OPPDFTemplate"
import { addJamalOP } from "../lib/ipc"

interface Doctor{
    id:number,
    name:string
  }

  type VitalName = "weight"|"height"|"temperature"|"pulse"|"bloodPressureSystolic"|"bloodPressureDiastolic"|"respiratoryRate"|"oxygenSaturation";

  interface Vital {
    id: VitalName,
    label:string,
    placeholder:string
  }

interface JamalOPForm {
    fullName: string,
    age: string,
    gender: string,
    contact: string,
    address: string,
    bloodGroup: string,
    assignDoctor:string,
    weight:string,
    height:string,
    temperature:string,
    pulse:string,
    bloodPressureSystolic:string,
    bloodPressureDiastolic:string,
    respiratoryRate:string,
    oxygenSaturation:string,
    consultationFee:string,
    paymentMode:string,
    paymentStatus:boolean,
    totalAmount:string

}

const defaultJamalOPData={
    fullName: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    bloodGroup: '',
    assignDoctor:'',
    weight:'',
    height:'',
    temperature:'',
    pulse:'',
    bloodPressureSystolic:'',
    bloodPressureDiastolic:'',
    respiratoryRate:'',
    oxygenSaturation:'',
    consultationFee:'',
    paymentMode:'',
    paymentStatus:false,
    totalAmount:''
  };
  const defaultVitals:Vital[]=[
                  { id: "weight", label: "Weight (kg) *", placeholder: "70.5" },
                  { id: "height", label: "Height (cm)", placeholder: "170" },
                  { id: "temperature", label: "Temperature (°C) *", placeholder: "98.6" },
                  { id: "pulse", label: "Pulse (bpm) *", placeholder: "72" },
                  { id: "bloodPressureSystolic", label: "BP Systolic *", placeholder: "120" },
                  { id: "bloodPressureDiastolic", label: "BP Diastolic *", placeholder: "80" },
                  { id: "respiratoryRate", label: "Respiratory Rate", placeholder: "16" },
                  { id: "oxygenSaturation", label: "O₂ Saturation (%)", placeholder: "98.0" }
                ];

const createOP = async (opData:JamalOPForm) :Promise<{ok:boolean,data:any}>=>{
    try {
            const result = await addJamalOP(opData);
            console.log("result:",result);
            if(result.ok) {return {ok:true,data:result?.data} }else{
                return {ok:false,data:"errorOccured"};
            }
        
    } catch (error) {
        console.error;
        return {ok:false,data:error};
        
    }
    

    
}

const downloadPdf=async (opData:any)=>{

    try {

         //first create the blob object using the pdf utitlity from react-pdf/renderer
         console.log("data from opdata",opData)
   const blob = await pdf(<OPPDFDocument opRecord={opData} />).toBlob();
    // create the url for the object
    const pdfURL = URL.createObjectURL(blob);
    //create a document with <a> tag as browsers allows to download using a tag
    const a = document.createElement('a');
    a.href=pdfURL;
    a.download=`${opData?.id}_${opData.fullName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(pdfURL);
    toast("sucessfully saved the jamal op")

        
    } catch (error) {
        console.log(error)
        
    }
   

}

export function JamalOP() {
  const [formData, setFormData] = useState<JamalOPForm>(defaultJamalOPData);
  
  

  const doctorsList:Doctor[] = [
    {name:"bhasha", id:0},
    {name:"jessi", id:1},
    {name:"chandra", id:2}
  ]


  const handleReset = ()=>{
    setFormData(defaultJamalOPData)

  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (!formData.fullName || !formData.age || !formData.gender || !formData.contact) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
          const res = await createOP({...formData}).then((res)=>res).catch((err)=>err);
          console.log("response from the createOP func:",res)
          if(res.ok){
            //create the pdf
             
             toast.success('Op created successfully');
             const downloadRes = await downloadPdf({...formData,...res.data,visitDate:new Intl.DateTimeFormat("en-US").format(Date.now())});
             console.log(downloadRes);

          }else{
            toast("unable to create op");
          }

          
        
    } catch (error) {
        console.error;
        toast("not able to create the op");
    
        
    }
    setFormData(defaultJamalOPData);
  

  
  };

  const handleConsultationFee = (e:ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,consultationFee:e.target.value,totalAmount:e.target.value})
  }



  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New OP 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="date">
                <Label>Date:{new Intl.DateTimeFormat("en-GB").format(Date.now())}</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>


                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter age"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value:string) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e)=>{setFormData({...formData,contact:e.target.value})}}
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value:string) => setFormData({ ...formData, bloodGroup: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assign Doctor</Label>
                  <Select value={formData.assignDoctor} onValueChange={(value:string)=>setFormData({...formData,assignDoctor:value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="select Doc"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      { doctorsList.map((doc,index)=><SelectItem key={index} value={doc.name}>{doc.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
              <h3>Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {defaultVitals.map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type="number"
                      step="0.1"
                      value={(formData as any)[id]}
                      onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                      placeholder={placeholder}

                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3>Payment Info</h3>
              <div>
                <div>
                  <Label>Consultation Fee</Label>
                  <Input type='number'
                  placeholder={"enter Conultation fee"}
                  onChange={handleConsultationFee}
                  />
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select onValueChange={(value:string)=>setFormData({...formData,paymentMode:value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={"select payment mode"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="other">other..</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select onValueChange={(value:string)=>value==="paid"?setFormData({...formData,paymentStatus:true}):setFormData({...formData,paymentStatus:false})}>
                    <SelectTrigger>
                      <SelectValue placeholder="setStatus"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid"> paid</SelectItem>
                      <SelectItem value="not paid">not Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Total Amount: {formData.totalAmount}.00</Label>
              </div>
            </div>

          
             
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create and Download OP
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={handleReset}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      
    </div>
  );
}


