function factorial(n) {
    if (n < 0n)
        throw new Error("Factorial of negative number!");
    if (n == 0n)
        return 1n;
    return n * factorial(n - 1n);
}
function updateFactorial() {
    let n = BigInt($("#integer").val() + "");
    let f;
    try {
        f = factorial(n).toString();
    }
    catch (e) {
        alert(e);
        return false;
    }
    let c = ((function (f) {
        let i;
        let k;
        let results = [];
        for (k = i = f.length; i >= 0; k = i += -3) {
            results.push(f.substring(k - 3, k));
        }
        return results;
    })(f)).reverse();
    let cc = (c[0] === "" ? c.slice(1) : c).join(",");
    $("#factorialOutput").html(cc);
    return true;
}
