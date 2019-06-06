$(document).ready(() => {
    setTimeout(setDefaultFilter, 1000);

    setDefaultFilter()
});

function setDefaultFilter() {
        var hash = window.location.hash;

    if (hash) {
        $('ul.mix-filter > li').removeClass('show active');
        $(hash).addClass('show active');
        link = $(hash).find('a');
        link.click();    
    } else {
        link = $('#work').find('a');
        link.click();    
    }

}