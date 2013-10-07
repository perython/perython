$(function(){
    // make all outside links' target to _blank
    $('a[href^="http://"]').attr('target', '_blank');

    $('nav li').removeClass('active');
    var p = document.location.pathname;
    $('nav li a[href="'+p.substr(0, p.indexOf('/', 1) + 1)+'"]').parent().addClass('active');
	
    // menu scrolling on mobile devices
    $('.mobile-header a').click(function(){
        var w;
        var showed = $(this).hasClass('show');
        if (showed) {
            w = '-240px';
            $(this).removeClass('show');
        } else {
            w = '0px';
            $(this).addClass('show');
        }
        $('header').animate({'margin-left': w}, 500, function(){
            if (showed) {
                $(this).css({'margin-left': ''});
            }
        });
        return false;
    });

    $('.msg').fadeOut(3000);
});