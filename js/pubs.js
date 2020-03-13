var hasProp = {}.hasOwnProperty;

$(function() {
  var P, display, renderArticle, renderArticles, renderNotices;
  P = {};
  renderArticle = function(article) {
    var a, au, authors, h, j, number, p, title, u;
    if (article.author[article.author.length - 1] === "et al.") {
      article.author[article.author.length - 1] = "<em>et al.</em>";
    }
    authors = ((function() {
      var i, len, ref, results;
      ref = article.author;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        au = ref[i];
        results.push(au.replace(/ +/g, "&nbsp;"));
      }
      return results;
    })()).join(", ");
    title = "&ldquo;" + article.title + "&rdquo;";
    h = [authors, title];
    number = article.number != null ? "(" + article.number + ")" : "";
    if (article.journal != null) {
      if (article.url != null) {
        u = article.url;
      } else {
        if (article.id != null) {
          u = "https://ui.adsabs.harvard.edu/abs/" + article.id + "/abstract";
        } else {
          u = null;
        }
      }
      j = article.journal.replace(/ +/g, "&nbsp;");
      if (article.conference != null) {
        h.push("&ldquo;" + article.conference + "&rdquo;");
      }
      h.push("<em>" + j + "</em> <strong>" + article.volume + "</strong>" + number + " (" + article.year + ") " + article.pages);
    } else {
      u = "https://arxiv.org/abs/" + article.id;
      h.push("arXiv:" + article.id);
    }
    p = $("<p/>").addClass("pub");
    if (u != null) {
      a = $("<a/>").attr("href", u).html(h.join(", ") + ".");
      a.appendTo(p);
    } else {
      p = p.html(h.join(", ") + ".");
    }
    return p;
  };
  renderArticles = function(articles) {
    var div, h3, i, k, len, p, r, ref, v;
    for (k in articles) {
      if (!hasProp.call(articles, k)) continue;
      v = articles[k];
      div = $("#" + k);
      div.empty();
      h3 = $("<h3/>").html(v.title).appendTo(div);
      ref = v.data;
      for (i = 0, len = ref.length; i < len; i++) {
        r = ref[i];
        p = renderArticle(r);
        p.appendTo(div);
      }
    }
    return true;
  };
  renderNotices = function(notices) {
    var a, d, d1, d6, div, h3, i, k, len, p, ref, u, v, z;
    for (k in notices) {
      if (!hasProp.call(notices, k)) continue;
      v = notices[k];
      div = $("#" + k);
      div.empty();
      h3 = $("<h3/>").html(v.title).appendTo(div);
      a = [];
      ref = v.data;
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
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
    return true;
  };
  display = function() {
    renderArticles(P.articles);
    renderNotices(P.notices);
    renderArticles(P.links);
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
