$(function() {
    $("#KTT-menu-toggle").on("click", function() {
        if ($("aside, header, KTT-menu-toggle").hasClass("inactive")){
            $("aside, header").removeClass("inactive");
        } else {
            $("aside, header").addClass("inactive");
        }
    });
});

function offCanvas() {
    /*console.log('fired');*/
    var height = $(window).height();
    var offCanvasHeight = parseInt(height);
    $('aside.kcc-app').css('height', offCanvasHeight);


}

function stickyfoot(){
    var footerHeight = $('#footer').height();
    var contentHeight = $('div.content-wrap').height();
    var sidebarHeight = $("aside.kcc-app").height();

    if (footerHeight + contentHeight < sidebarHeight) {
        $('div#footer').css('position','absolute').css('bottom','0px');
    } else {
        $('div#footer').css('position','static');
    }
}

$(document).ready(function() {
    offCanvas();
    stickyfoot();
    //$(window).bind('resize', offCanvas);
    var id;
    $(window).resize(function(){
        clearTimeout(id);
        id = setTimeout(doneResizing, 500);
    });
    function doneResizing(){
        offCanvas();
        stickyfoot();
    }


});