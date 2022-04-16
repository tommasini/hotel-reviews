import getTrainingSet from './database/traningset.js';
import cleaner from './preprocessing/index.js';
import fs from 'fs';
import { addUniqueTerms, binaryVector, numberOfOccurrencesVector, tfVector, sumVector, avgVector } from './features/bagofWords.js';
import Term from './Term.js';
/*var cp = [{
            browser: 'InternetExplorer',
            description: 'The room was small and messy',
            device: 'Desktop',
            id: 10329,
            label: 'happy'
        }, {
            browser: 'InternetExplorer',
            description: 'The breakfast was not very good',
            device: 'Desktop',
            id: 10328,
            label: 'happy'
        }, {
            browser: 'InternetExplorer',
            description: 'Breakfast very few choices',
            device: 'Desktop',
            id: 10327,
            label: 'happy'
        }];*/
export default class Train {

    getTermsFormatted(bafOfWords, docVectors) {
        return bafOfWords.map((term, i) => {
            return docVectors.map((docVector) => {
                return new Term(term, docVector.binaryVector[i], docVector.numberOfOccurrencesVector[i], docVector.tfVector[i], docVector.docId);
            });
        });
    }

    async process() {
        var corpus = await getTrainingSet();

        const happyDocs = corpus.filter((item) => { return item.label === 'happy' });
        const notHappyDocs = corpus.filter((item) => { return item.label === 'not happy' });

        const happyResultsProcessed = this.getResultsProcessed(happyDocs);
        const happyUnigramsMetricsVectors = this.getMetricsVectors(happyResultsProcessed.uniqueTermsUnigrams,
            happyResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n1.tokenization, id: value.id } }));
        const happyBigramsMetricsVectors = this.getMetricsVectors(happyResultsProcessed.uniqueTermsBigrams,
            happyResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n2.tokenization, id: value.id } }));

        var termsFormatted = this.getTermsFormatted(happyResultsProcessed.uniqueTermsUnigrams, happyUnigramsMetricsVectors);
        var termsSumMetrics = termsFormatted.map((value) => sumVector(value));
        var termsAvgMetrics = termsFormatted.map((value) => avgVector(value));

        console.log("====================== Happy Results =====================");
        fs.writeFile('results.txt', "====================== Happy Results =====================", 'UTF-8', () => { });
        this.printInConsole(happyResultsProcessed.documentsProcessed);
        this.saveInTxt(happyResultsProcessed.documentsProcessed);
        fs.appendFile('results.txt', "\n", 'UTF-8', () => { });
        console.log("\n");

        const notHappyResultsProcessed = this.getResultsProcessed(notHappyDocs);
        const notHappyUnigramsMetricsVectors = this.getMetricsVectors(notHappyResultsProcessed.uniqueTermsUnigrams,
            notHappyResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n1.tokenization, id: value.id } }));
        const notHappyBigramsMetricsVectors = this.getMetricsVectors(notHappyResultsProcessed.uniqueTermsBigrams,
            notHappyResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n2.tokenization, id: value.id } }));

        console.log("====================== Not Happy Results =====================");
        fs.appendFile('results.txt', "====================== Not Happy Results =====================", 'UTF-8', () => { });
        this.saveInTxt(notHappyResultsProcessed.documentsProcessed);
        this.printInConsole(notHappyResultsProcessed.documentsProcessed);
    }

    getMetricsVectors(bagOfWords, documents) {
        return documents.map((document) => {
            return {
                docId: document.id,
                binaryVector: binaryVector(bagOfWords, document.terms),
                numberOfOccurrencesVector: numberOfOccurrencesVector(bagOfWords, document.terms),
                tfVector: tfVector(bagOfWords, document.terms)
            }
        });
    }

    getMetricsVectors3(bagOfWords, documents) {
        var vectors = getMetricsVectors(bagOfWords, documents);
        let allTerms = documents.map(d => d.terms);
        return bagOfWords.map((document) => {
            let docId = document.id;
            if (docId == 10334) {
                console.log("k");
            }
            var results = {
                binaryVector: binaryVector(bagOfWords, document.terms),
                numberOfOccurrencesVector: numberOfOccurrencesVector(bagOfWords, document.terms),
                tfVector: tfVector(bagOfWords, document.terms),
                idfVector: idfVector(bagOfWords, allTerms),
                tfIdfVector: tfIdfVector(bagOfWords, document.terms, allTerms)
            };

            return document.terms.map((value, i) =>
                new Term(value, results.binaryVector[i], results.numberOfOccurrencesVector[i], results.tfVector[i], results.idfVector[i], results.tfIdfVector[i], docId)
            );
        });
    }

    getMetricsVectors2(bagOfWords, documents) {
        let allTerms = documents.map(d => d.terms);
        return documents.map((document) => {
            let docId = document.id;
            if (docId == 10334) {
                console.log("k");
            }
            var results = {
                binaryVector: binaryVector(bagOfWords, document.terms),
                numberOfOccurrencesVector: numberOfOccurrencesVector(bagOfWords, document.terms),
                tfVector: tfVector(bagOfWords, document.terms),
                idfVector: idfVector(bagOfWords, allTerms),
                tfIdfVector: tfIdfVector(bagOfWords, document.terms, allTerms)
            };

            return document.terms.map((value, i) =>
                new Term(value, results.binaryVector[i], results.numberOfOccurrencesVector[i], results.tfVector[i], results.idfVector[i], results.tfIdfVector[i], docId)
            );
        });
    }

    getResultsProcessed(docs) {
        let uniqueTermsUnigrams = [];
        let uniqueTermsBigrams = [];

        let documentsProcessed = docs.map((doc) => {
            var result = {
                id: doc.id,
                n1: cleaner(doc.description, 1),
                n2: cleaner(doc.description, 2),
            }

            uniqueTermsUnigrams = addUniqueTerms(uniqueTermsUnigrams, result.n1.tokenization);
            uniqueTermsBigrams = addUniqueTerms(uniqueTermsBigrams, result.n2.tokenization);

            return result;
        });

        return {
            uniqueTermsUnigrams,
            uniqueTermsBigrams,
            documentsProcessed
        }
    }

    printInConsole(list) {
        list.forEach((doc) => {
            console.log(`\nDocument nº: ${doc.id}`);
            console.log(`N1 - stopWords: ${doc.n1.stopWords}`);
            console.log(`N1 - cleanedText: ${doc.n1.cleanedText}`);
            console.log(`N1 - stemmedText: ${doc.n1.stemmedText}`);
            console.log(`N1 - tokenization: ${doc.n1.tokenization}`);
            console.log(`=====================================`);
            console.log(`N2 - stopWords: ${doc.n2.stopWords}`);
            console.log(`N2 - cleanedText: ${doc.n2.cleanedText}`);
            console.log(`N2 - stemmedText: ${doc.n2.stemmedText}`);
            console.log(`N2 - tokenization: ${doc.n2.tokenization}`);
            console.log("\n\n");
        });
    }

    saveInTxt(list) {
        list.forEach((doc) => {
            let text = `\nDocument nº: ${doc.id}\n
                        N1 - stopWords: ${doc.n1.stopWords}\n
                        N1 - cleanedText: ${doc.n1.cleanedText}\n
                        N1 - stemmedText: ${doc.n1.stemmedText}\n
                        N1 - tokenization: ${doc.n1.tokenization}\n
                        =====================================\n
                        N2 - stopWords: ${doc.n2.stopWords}\n
                        N2 - cleanedText: ${doc.n2.cleanedText}\n
                        N2 - stemmedText: ${doc.n2.stemmedText}\n
                        N2 - tokenization: ${doc.n2.tokenization}\n\n`;
            fs.appendFile('results.txt', text, 'UTF-8', () => { });
        });
    }
}