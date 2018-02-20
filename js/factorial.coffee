updateFactorial = () ->
    n = new BigNumber $("#integer").val()
    try
        f = n.factorial().toString()
    catch error
        alert error
        return false
    $("#factorialOutput").html(f)
    true
