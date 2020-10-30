$(function () {
    let P;
    let renderArticle = function (article) {
        if (article.author[article.author.length - 1] === "et al.")
            article.author[article.author.length - 1] = "<em>et al.</em>";
        let authors = ((function (a) {
            let results = [];
            for (let i = 0; i < a.length; i++)
                results.push(a[i].replace(/ +/g, "&nbsp;"));
            return results.join(", ");
        })(article.author));
        let h = [authors, "&ldquo;" + article.title + "&rdquo;"];
        let a = article;
        let number = a.hasOwnProperty("number") ? "(" + a.number + ")" : "";
        let u = "";
        if (article.hasOwnProperty("journal")) {
            if (article.hasOwnProperty("url")) {
                u = a.url;
            }
            else {
                if (article.hasOwnProperty("id")) {
                    let b = article;
                    u = "https://ui.adsabs.harvard.edu/abs/" + b.id + "/abstract";
                }
            }
            let aa = article;
            let j = aa.journal.replace(/ +/g, "&nbsp;");
            let aaa = article;
            if (aaa.hasOwnProperty("conference")) {
                h.push("&ldquo;" + aaa.conference + "&rdquo;");
            }
            h.push("<em>" + j + "</em> <strong>" + aa.volume + "</strong>" + number + " (" + aa.year + ") " + aa.pages);
        }
        else {
            let aaaa = article;
            u = "https://arxiv.org/abs/" + aaaa.id;
            h.push("arXiv:" + aaaa.id);
        }
        let p = $("<p/>").addClass("pub");
        if (u != "") {
            $("<a/>").attr("href", u).html(h.join(", ") + ".").appendTo(p);
        }
        else {
            p = p.html(h.join(", ") + ".");
        }
        return p;
    };
    let renderArticles = function (articles) {
        let k;
        for (k in articles) {
            if (!articles.hasOwnProperty(k))
                continue;
            let div = $("#" + k);
            div.empty();
            $("<h3/>").html(articles[k].title).appendTo(div);
            for (let i = 0; i < articles[k].data.length; i++) {
                renderArticle(articles[k].data[i]).appendTo(div);
            }
        }
    };
    let renderNotices = function (notices) {
        let k;
        for (k in notices) {
            if (!notices.hasOwnProperty(k))
                continue;
            let div = $("#" + k);
            div.empty();
            $("<h3/>").html(notices[k].title).appendTo(div);
            let a = [];
            for (let i = 0; i < notices[k].data.length; i++) {
                let d = notices[k].data[i];
                let u;
                if (k === "cbet") {
                    let d6 = d < 1000 ? "000" + d : "00" + d;
                    let d1 = d < 1000 ? Math.floor(d / 100) * 100 : Math.floor(d / 1000) * 1000;
                    let z = d < 1000 ? "000" + d1 : "00" + d1;
                    u = notices[k].url.replace(/%06d/, d6).replace(/%s/, z);
                }
                else {
                    u = notices[k].url.replace(/%d/, "" + d);
                }
                a.push("<a href=\"" + u + "\">" + d + "</a>");
            }
            $("<p/>").html(a.join(", ")).appendTo(div);
        }
    };
    let display = function () {
        renderArticles(P.articles);
        renderNotices(P.notices);
        renderArticles(P.links);
    };
    let onDataReceived = function (data) { P = data; };
    if ($.isEmptyObject(P))
        $.getJSON('pubs.json', {}, onDataReceived).fail(function () { alert("Data retrieval error!"); }).done(display);
});
