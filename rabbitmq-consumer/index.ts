import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";

import { RabbitMQClient } from "./rabbitmq"; // Adjust the import path accordingly

// Load environment variables
dotenv.config();

// Email configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""; // Required for SendGrid
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@proposal.com";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "XXX";

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send an email using the configured transporter.
 */
async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const msg: MailDataRequired = {
    to,
    subject: subject,
    from: {
      name: EMAIL_FROM_NAME,
      email: FROM_EMAIL,
    },
    html: body,
  };

  await sgMail.send(msg);
  console.log("Using SendGrid as the email service.");
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

/**
 * Process an email task from the RabbitMQ queue.
 */
async function processEmailTask(msg: any) {
  try {
    // Parse the email task
    const emailData = JSON.parse(msg.content.toString());
    const { to, subject, body } = emailData;

    // Send the email
    await sendEmail(to, subject, body);

    const rabbitMQClient = RabbitMQClient.getInstance<EmailData>();

    rabbitMQClient.channel.ack(msg);
  } catch (error) {
    console.error("Failed to process email task:", error);
  }
}

/**
 * Start the RabbitMQ consumer to listen for email tasks.
 */
async function startConsumer(): Promise<void> {
  try {
    const rabbitMQClient = RabbitMQClient.getInstance<EmailData>();
    await rabbitMQClient.connect();

    // Declare the queue
    await rabbitMQClient.channel.assertQueue(RabbitMQClient.EMAIL_QUEUE, {
      durable: false,
    });

    console.log("Email service is running. Waiting for email tasks...");
    await rabbitMQClient.channel.consume(
      RabbitMQClient.EMAIL_QUEUE,
      processEmailTask
    );
  } catch (error) {
    console.error("Error in RabbitMQ consumer:", error);
  }
}

// Start the email service
startConsumer();
