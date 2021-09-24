function addZero(text, needLength, symbol = "0") {
    if(text.length >= needLength) return text;
    text = "" + text;
    while (needLength > text.length) {
        text =  symbol + text;
    }
    return text;
}
