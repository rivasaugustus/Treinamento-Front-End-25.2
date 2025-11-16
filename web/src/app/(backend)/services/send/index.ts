import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(userEmail: string, subject: string, status: string) {
    const { data, error } = await resend.emails.send({
        from: 'Augustus <augustus.rivas@polijunior.com.br>',
        to: [userEmail],
        subject: subject,
        react: EmailTemplate({ status }),
    });
}