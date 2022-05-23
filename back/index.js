import { getDocument, getDocuments } from "./database/corpus.js";
import cleaner from "./preprocessing/index.js";

import express from "express";
import cors from "cors";
import corsConfig from "./cors.js";
import bodyParser from "body-parser";
import Train from "./train.js";
import { getBestKResults, getValidationSet } from "./database/traningset.js";
import { cosineSimilarity, classifyBayes } from "./classifier.js";

const app = express();
app.use(cors(corsConfig));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();
});

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

app.get("/process", async function (req, res) {
  var train = new Train();
  await train.process();
  res.sendStatus(200);
});

app.get("/processk", async function (req, res) {
  var unik = req.query.unik || 1;
  var bik = req.query.bik || 1;
  var train = new Train();
  await train.processBestK(unik, bik);
  res.sendStatus(200);
});

app.get("/results", async function (req, res) {
  var result = await getBestKResults();

  res.json(result);
});

app.get("/classify-cosine", async function (req, res) {
  var train = new Train();
  var classVectors = await train.classVectors();

  var validationSet = await getValidationSet();
  var results = validationSet.map((value, index, array) => {
    return {
      "text": value.description,
      "real": value.label,
      "classified": cosineSimilarity(value.description, classVectors)
    }
  });

  res.json({
    validation: validateResults(results),
    results
  });
});

app.get("/classify-bayes", async function (req, res) {
  var train = new Train();
  var classVectors = await train.classVectors();
  var happyLikelihood = await train.classLikelihood("happy");
  var notHappyLikelihood = await train.classLikelihood("not happy");

  var validationSet = await getValidationSet();
  var results = validationSet.map((value) => {
    return {
      "text": value.description,
      "real": value.label,
      "classified": classifyBayes(value.description, classVectors, happyLikelihood, notHappyLikelihood)
    }
  });


  res.json({
    validation: validateResults(results),
    results
  });
});

function validateResults(results) {
  let correctResults = results.filter((value) => value.real == value.classified);
  return {
    correct: Math.round((correctResults.length / results.length) * 100) + "%",
    incorrect: Math.round(((results.length - correctResults.length) / results.length) * 100) + "%",
  }
}

var server = app.listen(8081, async function () {
  var host =
    server.address().address === "::" ? "localhost" : server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
