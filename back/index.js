const { getDocument, getDocuments } = require("./database/corpus");

var express = require("express");
var app = express();

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

var server = app.listen(8081, async function () {
    var host = server.address().address === "::" ? "localhost" :
        server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});