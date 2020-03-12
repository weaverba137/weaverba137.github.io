var hasProp = {}.hasOwnProperty;

$(function() {
  var P, display;
  P = {};
  display = function() {
    var a, au, authors, d, d1, d6, div, h, h3, i, j, k, l, len, len1, p, r, ref, ref1, ref2, ref3, title, u, v, z;
    ref = P.notices;
    for (k in ref) {
      if (!hasProp.call(ref, k)) continue;
      v = ref[k];
      div = $("#" + k);
      div.empty();
      h3 = $("<h3/>").html(v.title).appendTo(div);
      a = [];
      ref1 = v.data;
      for (i = 0, len = ref1.length; i < len; i++) {
        d = ref1[i];
        if (k === "cbet") {
          d6 = d < 1000 ? "000" + d : "00" + d;
          d1 = d < 1000 ? Math.floor(d / 100) * 100 : Math.floor(d / 1000) * 1000;
          z = d < 1000 ? "000" + d1 : "00" + d1;
          u = v.url.replace(/%06d/, d6).replace(/%s/, z);
        } else {
          u = v.url.replace(/%d/, d);
        }
        a.push("<a href=\"" + u + "\">" + d + "</a>");
      }
      p = $("<p/>").html(a.join(", ")).appendTo(div);
    }
    ref2 = P.other;
    for (k in ref2) {
      if (!hasProp.call(ref2, k)) continue;
      v = ref2[k];
      div = $("#" + k);
      div.empty();
      h3 = $("<h3/>").html(v.title).appendTo(div);
      ref3 = v.data;
      for (l = 0, len1 = ref3.length; l < len1; l++) {
        r = ref3[l];
        if (r.author[r.author.length - 1] === "et al.") {
          r.author[r.author.length - 1] = "<em>et al.</em>";
        }
        authors = ((function() {
          var len2, m, ref4, results;
          ref4 = r.author;
          results = [];
          for (m = 0, len2 = ref4.length; m < len2; m++) {
            au = ref4[m];
            results.push(au.replace(/ +/g, "&nbsp;"));
          }
          return results;
        })()).join(", ");
        title = "&ldquo;" + r.title + "&rdquo;";
        h = [authors, title];
        if (k === "arXiv") {
          u = "https://arxiv.org/abs/" + r.id;
          h.push(k + ":" + r.id);
        } else {
          u = "https://ui.adsabs.harvard.edu/abs/" + r.id + "/abstract";
          j = r.journal.replace(/ +/g, "&nbsp;");
          h.push("<em>" + j + "</em> <strong>" + r.volume + "</strong> (" + r.year + ") " + r.pages);
        }
        p = $("<p/>").addClass("pub");
        a = $("<a/>").attr("href", u).html(h.join(", ") + ".");
        a.appendTo(p);
        p.appendTo(div);
      }
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
