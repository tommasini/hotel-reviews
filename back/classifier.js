import cleaner from './preprocessing/index.js';
import { addUniqueTerms, tfVector } from "./features/bagOfWords.js";

export function cosineSimilarity(text, classVectors) {
    var cleaningResult = cleaner(text, 1);
    var uniqueTerms = addUniqueTerms(cleaningResult.tokenization, []);
    //happy
    var tfVectorResult = tfVector(classVectors.happy.bagofwords, uniqueTerms);
    var tfidfVector = classVectors.happy.idf.map((value, index) => {
        return value * tfVectorResult[index];
    });
    var happySimilarity = calculateCosineSimilarity(classVectors.happy.tfidf, tfidfVector);

    //not happy
    tfVectorResult = tfVector(classVectors.nothappy.bagofwords, uniqueTerms);
    tfidfVector = classVectors.nothappy.idf.map((value, index) => {
        return value * tfVectorResult[index];
    });
    var nothappySimilarity = calculateCosineSimilarity(classVectors.nothappy.tfidf, tfidfVector);
    return happySimilarity < nothappySimilarity ? "happy" : "not happy";
}

function calculateCosineSimilarity(v1, v2) {
    var dotproduct = 0;
    var mV1 = 0;
    var mV2 = 0;
    for (var i = 0; i < v1.length; i++) {
        dotproduct += (v1[i] * v2[i]);
        mV1 += (v1[i] * v1[i]);
        mV2 += (v2[i] * v2[i]);
    }
    mV1 = Math.sqrt(mV1);
    mV2 = Math.sqrt(mV2);
    var similarity = (dotproduct) / (mV1) * (mV2)
    return similarity;
}

export function classifyBayes(text, classVectors, happyLikelihood, notHappyLikelihood) {
    var cleaningResult = cleaner(text, 1);
    var uniqueTerms = addUniqueTerms(cleaningResult.tokenization, []);
    //happy
    var tfVectorResult = tfVector(classVectors.happy.bagofwords, uniqueTerms);
    var termLikehood = tfVectorResult.map((value) => {
        return (value + 1) / tfVectorResult.length;
    });
    var happyResult = termLikehood.reduce((a, b) => a * b) * happyLikelihood;

    //not happy
    tfVectorResult = tfVector(classVectors.nothappy.bagofwords, uniqueTerms);
    termLikehood = tfVectorResult.map((value) => {
        return (value + 1) / tfVectorResult.length;
    });
    var notHappyResult = termLikehood.reduce((a, b) => a * b) * notHappyLikelihood;

    return happyResult >= notHappyResult ? "happy" : "not happy";;
}