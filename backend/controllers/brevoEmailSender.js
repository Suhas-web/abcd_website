import {
  AccountApi,
  AccountApiApiKeys,
  TransactionalEmailsApi,
  SendSmtpEmail,
} from "@getbrevo/brevo";
import errorHandler from "../middleware/errorHandler.js";
import pkg from "@getbrevo/brevo";
const { SibApiV3Sdk } = pkg;
const API_KEY = process.env.BREVO_API_KEY;

const setup = errorHandler(async (req, res) => {
  let apiInstance = new AccountApi();
  apiInstance.setApiKey(AccountApiApiKeys.apiKey, API_KEY);
  apiInstance.getAccount().then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
      res.send(data);
    },
    function (error) {
      console.error(error);
      res.send(error);
    }
  );
});

const sendMail = errorHandler(async (req, res) => {
  let apiInstance = new TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY_SMTP;

  let sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = "Test";
  sendSmtpEmail.htmlContent =
    "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
  sendSmtpEmail.sender = { name: "John Doe", email: "smssuhas2@gmail.com" };
  sendSmtpEmail.to = [{ email: "smsuhas2@gmail.com", name: "Jane Doe" }];
  // sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
  // sendSmtpEmail.bcc = [{ name: "John Doe", email: "example@example.com" }];
  sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = {
    parameter: "My param value",
    subject: "New Subject",
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("Sent email. Returned data: " + JSON.stringify(data));
      res.send(data);
    },
    function (error) {
      console.error(error);
      res.send(error);
    }
  );
});

export { setup, sendMail };
