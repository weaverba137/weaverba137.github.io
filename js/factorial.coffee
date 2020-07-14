updateFactorial = () ->
    n = new BigNumber $("#integer").val()
    try
        f = n.factorial().toString()
    catch error
        alert error
        return false
    c = (f.substring k-3, k for k in [f.length..0] by -3).reverse()
    cc = (if c[0] is "" then c[1..] else c).join ","
    # $("#factorialOutput").attr('value', cc)
    $("#factorialOutput").html cc
    true
