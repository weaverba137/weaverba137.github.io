/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
function toggle(link: string): void{
    let i = $(link).prev();
    let ul = $(link).next();
    while (ul.prop('nodeName') !== 'UL') {
        ul = ul.next();
    }
    if (ul.css('display') === 'none' || ul.css('display') === null) {
        ul.css('display', 'block');
        i.html('&blacktriangledown;&nbsp;');
    } else {
        ul.css('display', 'none');
        i.html('&blacktriangleright;&nbsp;');
    }
}
