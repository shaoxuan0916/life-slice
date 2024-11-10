import UserFeedbackEmail from "@/components/emails/UserFeedback";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, name, message } = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: `LifeSlice <support@lifeslice.pro>`,
      to: ["shaoxuandev10@gmail.com"],
      subject: "User Feedback",
      react: UserFeedbackEmail({ name: name, email: email, message: message }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
