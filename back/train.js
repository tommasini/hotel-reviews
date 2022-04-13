import getTrainingSet from './database/traningset.js';
import cleaner from './preprocessing/index.js';
import fs from 'fs';
import { addUniqueTerms, binaryVector, numberOfOccurrencesVector, tfVector, idfVector, tfIdfVector } from './features/bagofWords.js';

export default class Train {
    async process() {
        var corpus = await getTrainingSet();
        const happyDocs = corpus.filter((item) => { return item.label === 'happy' });
        const notHappyDocs = corpus.filter((item) => { return item.label === 'not happy' });

        const happyResultsProcessed = this.getResultsProcessed(happyDocs);
        const happyUnigramsMetricsVectors = this.getMetricsVectors(happyResultsProcessed.uniqueTermsUnigrams, happyResultsProcessed.documentsProcessed.map((value) => value.n1.tokenization));
        const happyBigramsMetricsVectors = this.getMetricsVectors(happyResultsProcessed.uniqueTermsBigrams, happyResultsProcessed.documentsProcessed.map((value) => value.n2.tokenization));

        console.log("====================== Happy Results =====================");
        fs.writeFile('results.txt', "====================== Happy Results =====================", 'UTF-8', () => { });
        this.printInConsole(happyResultsProcessed);
        this.saveInTxt(happyResultsProcessed);
        fs.appendFile('results.txt', "\n", 'UTF-8', () => { });
        console.log("\n");

        const notHappyResultsProcessed = this.getResultsProcessed(notHappyDocs);
        const notHappyUnigramsMetricsVectors = this.getMetricsVectors(notHappyResultsProcessed.uniqueTermsUnigrams, notHappyResultsProcessed.documentsProcessed.map((value) => value.n1.tokenization));
        const notHappyBigramsMetricsVectors = this.getMetricsVectors(notHappyResultsProcessed.uniqueTermsBigrams, notHappyResultsProcessed.documentsProcessed.map((value) => value.n2.tokenization));
        console.log("====================== Not Happy Results =====================");
        fs.appendFile('results.txt', "====================== Not Happy Results =====================", 'UTF-8', () => { });
        this.saveInTxt(notHappyResultsProcessed);
        this.printInConsole(notHappyResultsProcessed);
    }

    getMetricsVectors(bagOfWords, documents) {
        return documents.map((terms) => {
            return {
                binaryVector: binaryVector(bagOfWords, terms),
                numberOfOccurrencesVector: numberOfOccurrencesVector(bagOfWords, terms),
                tfVector: tfVector(bagOfWords, terms),
                idfVector: idfVector(bagOfWords, documents),
                tfIdfVector: tfIdfVector(bagOfWords, terms, documents)
            };
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