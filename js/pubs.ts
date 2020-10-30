/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
interface BaseJournalArticle {
    author: string[];
    title: string;
    journal: string;
    volume: number;
    pages: string;
    year: number;

}

interface JournalArticle extends BaseJournalArticle {
    id: string;
}

interface JournalURLArticle extends BaseJournalArticle {
    number: number;
    url: string;
}

interface ProceedingsArticle extends JournalArticle {
    conference: string;
}

interface PreprintArticle {
    author: string[];
    title: string;
    id: string;
}

type PublishedArticle =
    | JournalArticle
    | JournalURLArticle
    | ProceedingsArticle;

type AnyArticle =
    | PublishedArticle
    | PreprintArticle;

interface Notices {
    title: string;
    url: string;
    data: number[];
}

interface ArticleSet {
    title: string;
    data: AnyArticle[];
}

interface MyArticles {
    trek: ArticleSet;
    snfactory: ArticleSet;
    sdss3: ArticleSet;
    sdss4: ArticleSet;
    desi: ArticleSet;
    decals: ArticleSet;
    other: ArticleSet;
}

interface OtherArticles {
    published: ArticleSet;
    arXiv: ArticleSet;
}

interface MyNotices {
    astronomerstelegram: Notices;
    cbet: Notices;
}

interface Publications {
    articles: MyArticles;
    notices: MyNotices;
    links: OtherArticles;
}

type ArticleData =
    | MyArticles
    | OtherArticles;

$(
    function(): void {
        let P: Publications;
        let renderArticle = function(article: AnyArticle): JQuery<HTMLElement> {
            // var a, au, authors, h, j, number, p, title, u;
            if (article.author[article.author.length - 1] === "et al.")
                article.author[article.author.length - 1] = "<em>et al.</em>";
            let authors: string;
            // authors = ((function() {
            //   var i, len, ref, results;
            //   ref = article.author;
            //   results = [];
            //   for (i = 0, len = ref.length; i < len; i++) {
            //     au = ref[i];
            //     results.push(au.replace(/ +/g, "&nbsp;"));
            //   }
            //   return results;
            // })()).join(", ");
            let title: string = "&ldquo;" + article.title + "&rdquo;";
            let h: string[] = [authors, title];
            let a = article as JournalURLArticle;
            let number: string = a.hasOwnProperty("number") ? "(" + a.number + ")" : "";
            let u: string = "";
            if (article.hasOwnProperty("journal")) {
                if (article.hasOwnProperty("url")) {
                    u = a.url;
                } else {
                    if (article.hasOwnProperty("id")) {
                        let b = article as JournalArticle;
                        u = "https://ui.adsabs.harvard.edu/abs/" + b.id + "/abstract";
                    }
                }
                let aa = article as JournalArticle;
                let j: string = aa.journal.replace(/ +/g, "&nbsp;");
                let aaa = article as ProceedingsArticle;
                if (aaa.hasOwnProperty("conference")) {
                    h.push("&ldquo;" + aaa.conference + "&rdquo;");
                }
                h.push("<em>" + j + "</em> <strong>" + aa.volume + "</strong>" + number + " (" + aa.year + ") " + aa.pages);
            } else {
                let aaaa = article as PreprintArticle;
                u = "https://arxiv.org/abs/" + aaaa.id;
                h.push("arXiv:" + aaaa.id);
            }
            let p: JQuery<HTMLElement> = $("<p/>").addClass("pub");
            if (u != "") {
                $("<a/>").attr("href", u).html(h.join(", ") + ".").appendTo(p);
            } else {
                p = p.html(h.join(", ") + ".");
            }
            return p;
        };
        let renderArticles = function(articles: ArticleData): void {
            let k: string;
            for (k in articles) {
                if (!articles.hasOwnProperty(k)) continue;
                let div: JQuery<HTMLElement> = $("#" + k);
                div.empty();
                $("<h3/>").html(articles[k].title).appendTo(div);
                for (let i: number = 0; i < articles[k].data.length; i++) {
                    renderArticle(articles[k].data[i]).appendTo(div);
                }
            }
        };
        let renderNotices = function(notices: MyNotices): void {
            let k: string;
            for (k in notices) {
                if (!notices.hasOwnProperty(k)) continue;
                let div: JQuery<HTMLElement> = $("#" + k);
                div.empty();
                $("<h3/>").html(notices[k].title).appendTo(div);
                let a: string[];
                for (let i: number = 0; i < notices[k].data.length; i++) {
                    let d: number = notices[k].data[i];
                    let u: string;
                    if (k === "cbet") {
                        let d6: string = d < 1000 ? "000" + d : "00" + d;
                        let d1: number = d < 1000 ? Math.floor(d / 100) * 100 : Math.floor(d / 1000) * 1000;
                        let z: string = d < 1000 ? "000" + d1 : "00" + d1;
                        u = notices[k].url.replace(/%06d/, d6).replace(/%s/, z);
                    } else {
                        u = notices[k].url.replace(/%d/, "" + d);
                    }
                    a.push("<a href=\"" + u + "\">" + d + "</a>");
                }
                $("<p/>").html(a.join(", ")).appendTo(div);
            }
        };
        let display = function(): void {
            renderArticles(P.articles);
            renderNotices(P.notices);
            renderArticles(P.links);
        };
        let onDataReceived = function(data: Publications): void { P = data;};
        if ($.isEmptyObject(P))
            $.getJSON('pubs.json', {}, onDataReceived).fail(function(): void { alert("Data retrieval error!"); }).done(display);
    }
);
