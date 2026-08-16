// IPPDFPreview.tsx
import { PDFViewer } from '@react-pdf/renderer';
import { OPPDFDocument} from "./OPPDFTemplate"

export function IPPDFPreview() {
    const opRecord = {
    fullName: 'rajesh',
    age: '22',
    gender: 'Male',
    contact: '9874563210',
    address: 'ullagallu',
    bloodGroup: 'B+',
    assignDoctor:'Bhasha',
    weight:'78',
    height:'150',
    temperature:'98',
    pulse:'17',
    bloodPressureSystolic:'120',
    bloodPressureDiastolic:'80',
    respiratoryRate:'16',
    oxygenSaturation:'99',
    consultationFee:'100',
    paymentMode:'upi',
    paymentStatus:false,
    totalAmount:'100'
  };
  return (
    <div style={{ height: '100vh' }}>
      <PDFViewer width="100%" height="100%">
        <OPPDFDocument
          opRecord={opRecord}
        />
      </PDFViewer>
    </div>
  );
}
