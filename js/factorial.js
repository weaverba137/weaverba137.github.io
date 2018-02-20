var updateFactorial;

updateFactorial = function() {
  var error, f, n;
  n = new BigNumber($("#integer").val());
  try {
    f = n.factorial().toString();
  } catch (_error) {
    error = _error;
    alert(error);
    return false;
  }
  $("#factorialOutput").html(f);
  return true;
};
