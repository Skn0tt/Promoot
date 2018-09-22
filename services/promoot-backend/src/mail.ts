import { createTransport, Transporter } from "nodemailer";
import Mustache from "mustache";
import { getConfig } from "./config";
import { Ticket } from "./entities/Ticket";
import { renderQrCode } from "./qrCode";

const { mailTicketUrlTemplate, mailBodyTemplate, mailSubjectTemplate, smtp } = getConfig();

let transport: Transporter | null = null;

Mustache.parse(mailBodyTemplate);
Mustache.parse(mailSubjectTemplate);
Mustache.parse(mailTicketUrlTemplate);

export const sendTicket = async (ticket: Ticket) => {
  const subject = Mustache.render(mailSubjectTemplate, ticket);
  const text = Mustache.render(mailBodyTemplate, ticket);
  const ticketUrl = Mustache.render(mailTicketUrlTemplate, ticket);

  const qrCodeDataUrl = await renderQrCode(ticketUrl);

  await transport.sendMail({
    subject,
    text,
    from: smtp.sender,
    to: ticket.email,
    attachments: [{
      filename: "ticket.png",
      path: qrCodeDataUrl,
      contentType: "image/png"
    }]
  });

  console.log(`Successfuly dispatched ticket to ${ticket.email}`);
}

export const setupMail = async () => {
  try {
    const { smtp } = getConfig();
    transport = createTransport({
      host: smtp.host,
      port: smtp.port,
      auth: {
        user: smtp.username,
        pass: smtp.password
      }
    });

    await transport.verify();
  } catch (error) {
    console.log("Couldn't connect SMTP: ", error);
    process.exit(1);
  }
}