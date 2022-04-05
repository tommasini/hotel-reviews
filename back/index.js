import { getDocument, getDocuments } from "./database/corpus.js";
import cleaner from "./preprocessing/index.js";

import express from 'express';
import cors from "cors";

const app = express();
app.use(cors());

app.get("/corpus", async function (req, res) {
  var limit = req.query.limit;
  var label = req.query.label;

  var result = await getDocuments(label, limit);
  res.json(result);
});

app.get("/corpus/:id", async function (req, res) {
  var id = req.params.id;

  var result = await getDocument(id);
  res.json(result[0]);
});

app.post("/cleaner", async function (req, res) {
  var text = req.body.text;
  var number = req.body.number;

  var result = cleaner(text, number);
  res.json(result);
});

var server = app.listen(8081, async function () {
  var host =
    server.address().address === "::" ? "localhost" : server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
