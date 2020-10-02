/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
function updateBitmask(name: string): void {
    let bitmask: number = 0;
    let big_two: bigint = 2n;
    let big_bitmask: bigint = 0n;
    $("input[name=" + name + "]").each(function(i: number): void {
        if ($(this).prop('checked')) {
            let p: string = ""+$(this).val();
            bitmask += Math.pow(2, parseInt(p));
            big_bitmask += big_two**BigInt(p);
        }
    });
    $("#" + name + "_mask").html((bitmask.toString()) + " (0x" + (bitmask.toString(16)) + ")");
    $("#" + name + "_bmask").html((big_bitmask.toString()) + " (0x" + (big_bitmask.toString(16)) + ")");
}


function checkAll(name: string, value: boolean): void {
    $("input[name=" + name + "]").prop('checked', value);
    updateBitmask(name);
}
