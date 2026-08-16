export const otpEmailTemplate = (otp:string) => `
<h2>Login OTP for Jamal Hospitals </h2>
<p> Your 6-digit otp is:</p>
<h1>${otp} </h1>
<p>valid for only 5 minutes.</p>`