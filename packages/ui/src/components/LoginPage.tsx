import React, { useState, useRef, ChangeEvent } from "react";
import { useApiClient } from "../../apiContext/ApiProvider";
import { Spinner, Button } from "@radix-ui/themes"

export default function LoginPage({onSuccessLogin}:{onSuccessLogin:()=>void}){
    const [email,setEmail] = useState<string>("");
    const [formSubmitting, setIsFormSubmitting] = useState<boolean>(false)
    const [showOtp, setShowOtp] = useState<boolean>(false);
    const inputsRef = useRef<HTMLInputElement[]>([]);
    let otp = useRef<number[]>(Array.from({length:6},(_,i)=>0));
    const api = useApiClient();

    const  handleEmailChange:React.ChangeEventHandler<HTMLInputElement>=(e)=>{
        const newMail = e.target.value;
        console.log(newMail);
        setEmail(newMail);

    }
    const handleLoginFormSubmit:React.SubmitEventHandler<HTMLFormElement>=async (e)=>{
        e.preventDefault();
       const payload = { mailId:email };
       console.log("having a netwrok call");
       const response = await api.login(payload);
       if(response){
        setShowOtp(true);
        setIsFormSubmitting(true);
       

       }else{
        alert("something went wrong");
       }
       
    }

    const handleOtpSubmit: React.MouseEventHandler<HTMLButtonElement>= async (e)=>{
        console.log("clicked",e);
        const otpNumber = otp.current.toString().replaceAll(",","");
        console.log(otpNumber);
        const response = await api.verifyOtp({mailId:email,otp:Number(otpNumber)})
        console.log("response verify otp",response);
        if(response)  {onSuccessLogin()} else alert("otp does not match add remainig functionality");
        
    }

    const handleOtpDelete =(event:React.KeyboardEvent<HTMLInputElement>,index:number)=>{
        console.log("kaydown event occured",event)
        if((event.key === "Backspace" || event.key === "Delete") && index > 0 && inputsRef.current[index].value ===""){
            console.log("backspace is performed")
            event.preventDefault();
            inputsRef.current[index-1].focus()
            

        }
    }

    const handleOtpPaste = (
  event: React.ClipboardEvent<HTMLInputElement>,
  startIndex: number
) => {
  event.preventDefault();

  const pastedText = event.clipboardData
    .getData("text")
    .replace(/\D/g, "");

  if (!pastedText) return;

  pastedText.split("").forEach((char, i) => {
    const index = startIndex + i;
    if (index >= inputsRef.current.length) return;

    inputsRef.current[index].value = char;
    otp.current[index] = Number(char);
  });

  const lastIndex = Math.min(
    startIndex + pastedText.length - 1,
    inputsRef.current.length - 1
  );

  inputsRef.current[lastIndex]?.focus();
};



    const handleOtpInputChange =(index:number,event:ChangeEvent<HTMLInputElement>)=>{
        event.target.value = event.target.value.replace(/\D/,"");
        otp.current[index]= Number(event.target.value)
        console.log(otp.current);
        if(event.target.value && inputsRef.current[index + 1])
        {inputsRef.current[index+1].focus()}

    }

    return <>
    <div className="flex flex-col items-center justify-center  h-screen ">
        <Spinner />
        <div className="w-md pb-6 pt-6 bg-neutral-50 shadow-neutral-700 shadow-md   mt-4 rounded-sm ml-2 mr-2">
        
        {
            !showOtp && <><div className="flex flex-col items-center ">     
                <h2 className="text-slate-950 "> Welcome back</h2>
                <p> Login to your Jamal Hospitals account</p>
                </div>
                <div className="mt-10">
                    <form onSubmit={handleLoginFormSubmit}>
                        <div className="flex flex-col gap-1 ml-2 mr-2 items-center">
                       
                         <label htmlFor="email"className="self-start ml-4">
                            Email:                                           
                        </label>
                        
                       
                        <input required type="email" name="email" id="email" onChange={handleEmailChange} className="bg-slate-100  p-2 rounded-sm w-sm shadow-sm " />
                        <Button className="bg-slate-900 rounded-sm text-slate-100 p-2 mt-1 w-sm" type="submit">{formSubmitting ? "Sending ..." :"GET OTP"}</Button>
                        <button type="submit" className="bg-slate-900 rounded-sm text-slate-100 p-2 mt-1 w-sm" >{formSubmitting ? "Sending ..." :"GET OTP"}</button>
                        </div>
                    </form>
                </div></>
       
        }

        {
            showOtp && <div>
                    <div className="flex flex-col items-center">
                        <div className="self-start ml-8">
                            <h3 >OTP sent to your email ({email}) account <br />  please verify your otp</h3>
                        </div>
                        <div className="flex flex-row gap-x-3 m-1 justify-center">
                            {
                                Array.from({length:6},(_,i)=>(
                            <input 
                            ref={(ele)=>( inputsRef.current[i] = ele)}
                            onChange={(e)=>handleOtpInputChange(i,e)}
                            onKeyDown={(e)=>handleOtpDelete(e,i)}
                            onPaste={(e) => handleOtpPaste(e, i)}
                            required
                            type="text" 
                            inputMode="numeric" 
                            maxLength={1} 
                            pattern="[0-9]*" 
                            name="otp" 
                            id="otp" 
                            className="p-2 rounded-sm w-12 h-12 bg-slate-100 shadow-blue-400 shadow-sm text-3xl text-center" />))
                            }

                             
                        </div>

                        <button className="bg-slate-900 rounded-sm text-slate-100 p-1 mt-1 w-sm"
                         onClick={handleOtpSubmit} > Verify </button>

                    </div>
                </div>
        }
                
        </div>

    </div>
    </>
}


function OTPSection(){

    return
}