import React, { useState, useRef, ChangeEvent } from "react";
import { useApiClient } from "@hms/ui/apiContext/ApiProvider";
import {  Button, TextField, Text,Flex, Container, Box, Heading } from "@radix-ui/themes"

export default function LoginPage({onSuccessLogin}:{onSuccessLogin:()=>void}){
    const [email,setEmail] = useState<string>("");
    const [formSubmitting, setIsFormSubmitting] = useState<boolean>(false)
    const [showOtp, setShowOtp] = useState<boolean>(false);
    const [otpVerifying,setOtpVerifying]= useState<boolean>(false);
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
          setIsFormSubmitting(true);
       const payload = { mailId:email };
       console.log("having a netwrok call");
       const response = await api.login(payload);
       if(response){
        setShowOtp(true);
       }else{
        alert("something went wrong");
       }
       setIsFormSubmitting(false);
    }

    const handleOtpSubmit: React.MouseEventHandler<HTMLButtonElement>= async (e)=>{
        console.log("clicked",e);
        setOtpVerifying(true);
        const otpNumber = otp.current.toString().replaceAll(",","");
        console.log(otpNumber);
        const response = await api.verifyOtp({mailId:email,otp:Number(otpNumber)})
        
        console.log("response verify otp",response);
        if(response){
            onSuccessLogin();
        } else alert("otp does not match, please try again");
        setOtpVerifying(false);
        
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
    <Flex direction="column" align="center" justify="center" height={"100vh"}> 
        <Box    width={"50vw"}>
            <Container minWidth={{sm:"2",md:"2",lg:"3"}} height={"30vh"}  style={{ boxShadow:"var(--shadow-3)",borderRadius:"var(--radius-3)"}} m="2" p="2" >
      {
        !showOtp && <Flex direction="column" justify={"center"}>     
                        <Heading as="h1" align="center"> Welcome back</Heading>
                        <Text as="p"> Login to your Jamal Hospitals account</Text>
                    <form onSubmit={handleLoginFormSubmit}>
                        <Flex direction={"column"} gap={"1"}>
                            <Heading as="h3" size={"3"} weight={"regular"}>Email:</Heading>
                            <TextField.Root placeholder="example@gmail.com" type="email" name="email" id="email" onChange={handleEmailChange} required />
                            <Button type="submit" loading={formSubmitting} variant="soft" radius="large" style={{width:"100%"}} >GET OTP</Button>
                        </Flex>
                    </form>
                </Flex>
       
        }

        {
            showOtp && <Box>
                        <Flex direction="column" align="center">
                            <h3 >OTP sent to your email ({email}) account <br />  please verify your otp</h3>
                        
                        <Flex direction="row" justify="start" gap="3">
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
                            className="p-2 rounded-sm w-12 h-12 bg-slate-100 shadow-gray-400 shadow-sm text-3xl text-center" />))
                            }
                        </Flex>          
                        <Button onClick={handleOtpSubmit} loading={otpVerifying} variant="soft" radius="large">
                            Verify Otp
                        </Button>

                 </Flex>
                </Box>
        }
        </Container>
 
        </Box>
       </Flex>
    
    </>
}


function OTPSection(){

    return
}