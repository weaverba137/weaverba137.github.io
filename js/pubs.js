$(function() {
  var Publications, onDataReceived;
  Publications = {
    data: {},
    display: function() {
      if (this.data.astronomerstelegram != null) {
        alert(this.data.astronomerstelegram.url.replace(/%d/, this.data.astronomerstelegram.data[0]));
      }
      return true;
    }
  };
  onDataReceived = function(data) {
    Publications.data = data;
    return true;
  };
  if ($.isEmptyObject(Publications.data)) {
    return $.getJSON('pubs.json', {}, onDataReceived).fail(function() {
      return alert("Data retrieval error!");
    }).done(Publications.display);
  }
});
