$(function(){
    $('.books-container').imagesLoaded( function(){
        $(this).masonry({
            itemSelector : '.book',
            isResizable: true
        });
    });
});
