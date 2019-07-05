require("dotenv").config();
import { generateDoc } from "./GenerateDocx";
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Client } = require("pg");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "barbalatr@gmail.com",
  from: "no-reply@46report.com",
  subject: "Laudo Pericial",
  text: "testando o envio de email",
  html: "<strong>testando o envio de email</strong>"
};

var PORT = process.env.PORT || 5000;
const rootPath = url => path.join(process.cwd(), url);

const app = express()
  .use(bodyParser())
  .get("/", (request, response) => {
    response.sendFile(rootPath("./public/index.html"));
  })
  .get("/Browser.js", (request, response) => {
    response.sendFile(rootPath("./tmp/Browser.js"));
  })
  .post("/", (request, response) => {
    const { body } = request;
    console.log("req " + JSON.stringify(body));
    return saveAtendimento(request.body)
      .then(() => {
        generateDoc(request.body);
        return sendEmail(msg);
      })
      .then(() => {
        console.log("suc");
        response.json({ message: "ok" });
      })
      .catch(e => {
        console.log("err " + String(e));
        console.log(e);
        response.json({ message: "error" });
      });
  })

  .listen(PORT, () => {
    console.log("Server is running...");
  });

function sendEmail(msg) {
  sgMail.send(msg);
}

function saveAtendimento(body) {
  const client = new Client({
    host: "localhost",
    user: "barbalatr",
    port: 5432,
    database: "sptcdb"
  });
  return client
    .connect()
    .then(() =>
      client.query(
        "insert into atendimento values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,$22,$23)",
        [
          "Rodrigo Barbalat Viana",
          body.requisicao,
          body.laudo,
          body.boletim,
          body.natureza,
          body.delegacia,
          body.delegado,
          body.endereco,
          body.enderecoNumero,
          body.dataAtendimento,
          body.horaChegada,
          body.dataLiberacao,
          body.horaLiberacao,
          body.fotografo,
          body.tipoVeiculo,
          body.placa,
          body.marcaVeiculo,
          body.modeloVeiculo,
          body.corVeiculo,
          body.preservado,
          body.encarregado,
          body.reEncarregado,
          body.prefixoViatura
        ]
      )
    )
    .finally(() => {
      client.end();
    });
}
