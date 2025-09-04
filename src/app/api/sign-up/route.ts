import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import User from "@/model/User";
import bcrypt from "bcryptjs"; 
import { success } from "zod";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {email, username, password} =await request.json(
        )
        
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        
        if (existingUserVerifiedByUsername) {
            return Response.json({
                sucess: false,
                message: "username already exist",
            },
            {
                status: 400
            }
        )
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
            return Response.json({
            success: false,
            message: "user already exist with this email"
            },
            {
                status:400
            })
            }
            else{
                const hasedpassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hasedpassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifiedCodeExpiry= new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save()
            }
        }
        else{
            const hasedpassword = await bcrypt.hash(password, 10) 
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                    username,
                    email,
                    password: hasedpassword,
                    verifiedCode: verifyCode,
                    verifiedCodeExpiry: expiryDate,
                    isAcceptingMessages: false,
                    isVerified: true,
                    messages: [],
            })

            await newUser.save()
        }
        
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.sucess) {
            return Response.json({
                sucess: false,
                message: emailResponse.message || "verification email not send"
            },
        {
            status: 500
        })
        }
        return Response.json({
            success: true,
            message: "user registered sucessfully. please verify your email"
        },
    {
        status:201
    })
    } catch (error) {
        console.log("error regestring user", error);
        return Response.json(
            {
                sucess: false,
                message:"ERROR Register user"
            },
            {
                status: 500
            }
        )
        
    }
}