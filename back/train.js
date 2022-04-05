import getTrainingSet from './database/traningset.js';
import cleaner from './preprocessing/index.js';
import fs from 'fs';

export default class Train {
    async process() {
        var corpus = await getTrainingSet();
        const happyDocs = corpus.filter((item) => { return item.label === 'happy' });
        const notHappyDocs = corpus.filter((item) => { return item.label === 'not happy' });

        const happyResults = happyDocs.map((doc) => {
            return {
                id: doc.id,
                n1: cleaner(doc.description, 1),
                n2: cleaner(doc.description, 2)
            }
        });
        console.log("====================== Happy Results =====================");
        fs.writeFile('results.txt', "====================== Happy Results =====================", 'UTF-8', () => { });
        this.printInConsole(happyResults);
        this.saveInTxt(happyResults);
        fs.appendFile('results.txt', "\n", 'UTF-8', () => { });
        console.log("\n");

        const notHappyResults = notHappyDocs.map((doc) => {
            return {
                id: doc.id,
                n1: cleaner(doc.description, 1),
                n2: cleaner(doc.description, 2)
            }
        });

        console.log("====================== Not Happy Results =====================");
        fs.appendFile('results.txt', "====================== Not Happy Results =====================", 'UTF-8', () => { });
        this.saveInTxt(notHappyResults);
        this.printInConsole(notHappyResults);
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