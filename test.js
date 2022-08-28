function randomNumber(maxAmount) {
    if (maxAmount < 1) return 0;
    return Math.floor(Math.random() * maxAmount) + 1;
}
console.log(randomNumber(0));
