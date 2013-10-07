function decimalToHex(decimal) {
    var hex = decimal.toString(16);
    if (hex.length == 1) hex = '0' + hex;
    return hex;
}
function hexToDecimal(hex) {return parseInt(hex,16);}

function returnOpposite(colour) {
    return decimalToHex(255 - hexToDecimal(colour.substr(0,2)))
        + decimalToHex(255 - hexToDecimal(colour.substr(2,2)))
        + decimalToHex(255 -  hexToDecimal(colour.substr(4,2)));
}

$(function(){

    $('.project').each(function(){
        var color = Math.floor(Math.random()*16777215).toString(16);
        $(this).css({'background-color': '#'+color}); //find('a').css({'color': '#'+returnOpposite(color)});
    }).find('a').fancybox({
            type        : 'ajax',
            maxWidth	: 800,
            maxHeight	: 600,
            fitToView	: false,
            width		: '70%',
            height		: '70%',
            autoSize	: false,
            closeClick	: false,
            openEffect	: 'none',
            closeEffect	: 'none'
        });
});