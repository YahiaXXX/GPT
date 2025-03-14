import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

import Imap from "node-imap";
import { inspect } from "util";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
var content

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Codex",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// var imap = new Imap({
//     user: 'boukhyahia@gmail.com',
//     password: 'tfvqsxeffqgnzygz',
//     host: 'imap.gmail.com',
//     port: 993,
//     tls: true
//   });
  
//   function openInbox(cb) {
//     imap.openBox('INBOX', true, cb);
//   }
  
//   imap.once('ready', function() {
//     openInbox(function(err, box) {
//       if (err) throw err;
//       var f = imap.seq.fetch(box.messages.total, {
//         bodies: ['']
//       });
//       f.on('message', function(msg, seqno) {
//         // console.log('Message #%d', seqno);
//         var prefix = '(#' + seqno + ') ';
//         msg.on('body', function(stream, info) {
//           var buffer = '';
//           stream.on('data', function(chunk) {
//             buffer += chunk.toString('utf8');
//           });
//           stream.once('end', function() {
//             // console.log(buffer)
//             const match = buffer.match(/<div[^>]*>([^<]*)<\/div>/);

//             if (match) {
//               content = match[1];
//              console.log(content);
//                } else {
//                console.log('No matching div tag found.');
// }
//             // console.log(prefix + 'Body: %s', buffer);

//           });
//         });
//         msg.once('attributes', function(attrs) {
//         //   console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
//         });
//         msg.once('end', function() {
//         //   console.log(prefix + 'Finished');
//         });
//       });
//       f.once('error', function(err) {
//         // console.log('Fetch error: ' + err);
//       });
//       f.once('end', function() {
//         // console.log('Done fetching all messages!');
//         imap.end();
//       });
//     });
//   });
  
//   imap.once('error', function(err) {
//     // console.log(err);
//   });
  
//   imap.once('end', function() {
//     console.log('Connection ended');
//   });
  
//   imap.connect();
  
  app.get("/content", async (req, res) => {
    const vr=content 
    res.status(200).send({
      content: vr
    });
  });  
  app.post('/email', (req, res) => {
    const { body } = req;
    console.log(`Received email body: ${body}`);
    res.send('Email body received successfully');
  });

app.listen(5000, () => {
  console.log("server is running");
});
