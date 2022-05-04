export function selectKBest(terms, k, metric) {
    return terms.sort((t1, t2) => t1[metric] > t2[metric] ? 1 : -1).slice(0, k);
}