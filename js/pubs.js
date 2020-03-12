$(function() {
  var P, display;
  P = {};
  display = function() {
    var a, d, d1, d6, i, j, len, len1, p, ref, ref1, u, z;
    if (P.astronomerstelegram != null) {
      p = $('#astronomerstelegram');
      p.empty();
      a = [];
      ref = P.astronomerstelegram.data;
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        u = P.astronomerstelegram.url.replace(/%d/, d);
        a.push("<a href=\"" + u + "\">" + d + "</a>");
      }
      p.html(a.join(", "));
    }
    if (P.cbet != null) {
      p = $('#cbet');
      p.empty();
      a = [];
      ref1 = P.cbet.data;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        d = ref1[j];
        d6 = d < 1000 ? "000" + d : "00" + d;
        d1 = d < 1000 ? Math.floor(d / 100) * 100 : Math.floor(d / 1000) * 1000;
        z = d < 1000 ? "000" + d1 : "00" + d1;
        u = P.cbet.url.replace(/%06d/, d6).replace(/%s/, z);
        a.push("<a href=\"" + u + "\">" + d + "</a>");
      }
      p.html(a.join(", "));
    }
    return true;
  };
  if ($.isEmptyObject(P)) {
    return $.getJSON('pubs.json', {}, function(data) {
      return P = data;
    }).fail(function() {
      return alert("Data retrieval error!");
    }).done(display);
  }
});
