function replace(str) {
    var result = "";
    result = str.replace(/(\r\n|\n|\r|\t|\s)/gm,"");
    outlet(0, result)
}