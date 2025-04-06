const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;


const highPriorityPhrases = [
    "server down", "network failure", "security breach", "data loss",
    "cyber attack", "audit risk", "blocker", "shutdown"
];

const mediumPriorityPhrases = [
    "performance issue", "invoice issue", "missing payment",
    "customer dissatisfaction", "policy violation", "safety concern"
];

const highPriorityWords = [
    "urgent", "emergency", "critical", "immediate", "outage", "escalate",
    "harassment", "violence", "threat", "fraud", "accident", "injury", "hazard"
].map(word => stemmer.stem(word));

const mediumPriorityWords = [
    "delay", "slow", "concern", "pending", "problem",
    "glitch", "bug", "downtime", "lagging", "bias"
].map(word => stemmer.stem(word));

const calculatePriorityNLP = (description) => {
    const lowerDesc = description.toLowerCase();
    let highCount = 0;
    let mediumCount = 0;

    highPriorityPhrases.forEach(phrase => {
        if (lowerDesc.includes(phrase)) highCount++;
    });
    mediumPriorityPhrases.forEach(phrase => {
        if (lowerDesc.includes(phrase)) mediumCount++;
    });


    const words = tokenizer.tokenize(lowerDesc);
    const stemmedWords = words.map(word => stemmer.stem(word));
    
    stemmedWords.forEach(stemmedWord => {
        if (highPriorityWords.includes(stemmedWord)) highCount++;
        if (mediumPriorityWords.includes(stemmedWord)) mediumCount++;
    });

    if (highCount > 0) return "high";
    if (mediumCount > 0) return "medium";
    return "low";
};

module.exports = { calculatePriorityNLP };
