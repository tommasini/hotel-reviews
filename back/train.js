import { getTrainingSet, saveResults, saveBestResults, loadResults } from './database/traningset.js';
import cleaner from './preprocessing/index.js';
import fs from 'fs';
import { addUniqueTerms, binaryVector, numberOfOccurrencesVector, tfVector, sumVector, avgVector } from './features/bagofWords.js';
import Term from './Term.js';
import { selectKBest } from './features/featureSelection.js';

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

        var happyResults = this.processClass(happyDocs, "Happy");
        var notHappyResults = this.processClass(notHappyDocs, "Not Happy");

        const label1 = "Happy";
        const label2 = "Not Happy";
        await this.saveAllResults(happyResults, notHappyResults, label1, label2);

    }

    async processBestK(unik, bik) {
        var results = await loadResults();
        const label1 = "Happy";
        const label2 = "Not Happy";
        await this.saveAllBestKResults(results.happyResults, results.notHappyResults, label1, label2, unik, bik);
    }

    async saveAllResults(classResult1, classResult2, label1, label2) {
        await saveResults(classResult1.termsAvgMetrics, label1, 'avg', 1, true);
        await saveResults(classResult1.termsSumMetrics, label1, 'sum', 1);
        await saveResults(classResult1.bigramsTermsAvgMetrics, label1, 'avg', 2);
        await saveResults(classResult1.bigramsTermsSumMetrics, label1, 'sum', 2);

        await saveResults(classResult2.termsAvgMetrics, label2, 'avg', 1);
        await saveResults(classResult2.termsSumMetrics, label2, 'sum', 1);
        await saveResults(classResult2.bigramsTermsAvgMetrics, label2, 'avg', 2);
        await saveResults(classResult2.bigramsTermsSumMetrics, label2, 'sum', 2);
    }

    // alterar k e verificar melhor
    //classificação utilizaçao uni,<bigrmas ou ambas, analise disto
    async saveAllBestKResults(classResults1, classResults2, label1, label2, unik, bik) {
        await this.saveBestKResults(classResults1.termsAvgMetrics, unik, label1, 'avg', 1, true);
        await this.saveBestKResults(classResults1.termsSumMetrics, unik, label1, 'sum', 1);
        await this.saveBestKResults(classResults1.bigramsTermsAvgMetrics, bik, label1, 'avg', 2);
        await this.saveBestKResults(classResults1.bigramsTermsSumMetrics, bik, label1, 'sum', 2);

        await this.saveBestKResults(classResults2.termsAvgMetrics, unik, label2, 'avg', 1);
        await this.saveBestKResults(classResults2.termsSumMetrics, unik, label2, 'sum', 1);
        await this.saveBestKResults(classResults2.bigramsTermsAvgMetrics, bik, label2, 'avg', 2);
        await this.saveBestKResults(classResults2.bigramsTermsSumMetrics, bik, label2, 'sum', 2);
    }

    async saveBestKResults(terms, k, label, type, ngram, deleteAll = false) {
        let bestBinary = selectKBest(terms, k, "binary");
        let bestOccurrences = selectKBest(terms, k, "occurrences");
        let bestTf = selectKBest(terms, k, "tf");
        let bestTfidf = selectKBest(terms, k, "tfidf");
        await saveBestResults(bestBinary, label, type, ngram, "binary", deleteAll);
        await saveBestResults(bestOccurrences, label, type, ngram, "occurrences");
        await saveBestResults(bestTf, label, type, ngram, "tf");
        await saveBestResults(bestTfidf, label, type, ngram, "tfidf");
    }

    processClass(documents, className) {
        const classResultsProcessed = this.getResultsProcessed(documents);
        const classUnigramsMetricsVectors = this.getMetricsVectors(classResultsProcessed.uniqueTermsUnigrams,
            classResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n1.tokenization, id: value.id } }));
        const classBigramsMetricsVectors = this.getMetricsVectors(classResultsProcessed.uniqueTermsBigrams,
            classResultsProcessed.documentsProcessed.map((value) => { return { terms: value.n2.tokenization, id: value.id } }));

        var termsFormatted = this.getTermsFormatted(classResultsProcessed.uniqueTermsUnigrams, classUnigramsMetricsVectors);
        var termsSumMetrics = termsFormatted.map((value) => sumVector(value));
        var termsAvgMetrics = termsFormatted.map((value) => avgVector(value));

        var bigramsTermsFormatted = this.getTermsFormatted(classResultsProcessed.uniqueTermsBigrams, classBigramsMetricsVectors);
        var bigramsTermsSumMetrics = bigramsTermsFormatted.map((value) => sumVector(value));
        var bigramsTermsAvgMetrics = bigramsTermsFormatted.map((value) => avgVector(value));

        let filename = `${className}-results.txt`;
        console.log(`====================== ${className} Results =====================`);
        fs.writeFile(filename, `====================== ${className} Results =====================`, 'UTF-8', () => { });
        this.printInConsole(classResultsProcessed.documentsProcessed);
        this.saveInTxt(classResultsProcessed.documentsProcessed, filename);
        fs.appendFile(filename, "\n", 'UTF-8', () => { });
        console.log("\n");

        return {
            termsSumMetrics,
            termsAvgMetrics,
            bigramsTermsSumMetrics,
            bigramsTermsAvgMetrics
        }
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

    saveInTxt(list, filename) {
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
            fs.appendFile(filename, text, 'UTF-8', () => { });
        });
    }
}