import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RabbitMQClient } from "@/lib/rabbitmq";

type EmailMessage = {
  to: string;
  subject: string;
  body: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const id = (await params).id;

  const searchParams = req.nextUrl.searchParams
  const to = searchParams.get('to')

  if (!to) {
    return NextResponse.json({ message: "Missing 'to' parameter" });
  }

  const template = await prisma.emailTemplate.findUnique({
    where: { id },
  });

  try {
    const rabbitMQClient = RabbitMQClient.getInstance<EmailMessage>();

    const emailMessage = {
      to,
      subject: template?.subject || "no subject",
      body: template?.content || "no template",
    };

    // Publish the message to RabbitMQ queue
    await rabbitMQClient.sendToQueue(RabbitMQClient.EMAIL_QUEUE, emailMessage);
  } catch (e) {
    console.error(e); 
    return NextResponse.json(e);
  }

  return NextResponse.json(template);
}
