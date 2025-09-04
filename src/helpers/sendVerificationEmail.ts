import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onbording@resend.dev',
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({username, otp: verifycode}),
        });
        return {sucess: true, message:'Verification email send sucessfully'}
    
    } catch (emailError) {
        console.error("error sending verification email",emailError)
        return {sucess: false, message:'failed to send verification email'}
    }
}