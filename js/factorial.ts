/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
function factorial(n: bigint): bigint {
    if (n < 0n) throw new Error("Factorial of negative number!");
    if (n == 0n) return 1n;
    return n * factorial(n - 1n);
}


function updateFactorial(): boolean {
    // Coerce the return of .val() to string.
    let n: bigint = BigInt($("#integer").val() + "");
    let f: string;
    try {
        f = factorial(n).toString();
    } catch (e: any) {
        alert(e);
        return false;
    }
    let c: string[] = ((function(f: string): string[] {
        let i: number;
        let k: number;
        let results: string[] = [];
        for (k = i = f.length; i >= 0; k = i += -3) {
            results.push(f.substring(k - 3, k));
        }
        return results;
    })(f)).reverse();
    let cc: string = (c[0] === "" ? c.slice(1) : c).join(",");
    $("#factorialOutput").html(cc);
    return true;
}
