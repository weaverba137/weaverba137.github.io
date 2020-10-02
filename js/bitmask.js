function updateBitmask(name) {
    let bitmask = 0;
    let big_two = 2n;
    let big_bitmask = 0n;
    $("input[name=" + name + "]").each(function (i) {
        let p;
        if ($(this).prop('checked')) {
            p = parseInt("" + $(this).val());
            bitmask += Math.pow(2, p);
            big_bitmask += big_two ** BigInt(p);
        }
    });
    $("#" + name + "_mask").html((bitmask.toString()) + " (0x" + (bitmask.toString(16)) + ")");
    $("#" + name + "_bmask").html((big_bitmask.toString()) + " (0x" + (big_bitmask.toString(16)) + ")");
}
function checkAll(name, value) {
    $("input[name=" + name + "]").prop('checked', value);
    updateBitmask(name);
}
