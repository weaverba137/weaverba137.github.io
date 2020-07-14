var updateFactorial;

updateFactorial = function() {
  var c, cc, error, f, k, n;
  n = new BigNumber($("#integer").val());
  try {
    f = n.factorial().toString();
  } catch (error1) {
    error = error1;
    alert(error);
    return false;
  }
  c = ((function() {
    var i, ref, results;
    results = [];
    for (k = i = ref = f.length; i >= 0; k = i += -3) {
      results.push(f.substring(k - 3, k));
    }
    return results;
  })()).reverse();
  cc = (c[0] === "" ? c.slice(1) : c).join(",");
  $("#factorialOutput").html(cc);
  return true;
};
