var a_variable;
for(var x = 0; x < 21; x += 2) {
    a_variable = Math.floor(x / 2);
}

module.exports = {
    getMyValue: function() {
        var f = 10;
        return parseInt(f.toString().charAt(0));
    }
}