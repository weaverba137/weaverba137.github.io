$(function() {
  onDataReceived(function() {
    return data;
  });
  return $.getJSON('lib/qso.json', {}, onDataReceived).error(function() {
    return alert("Data retrieval error!");
  }).complete(replot);
});
