/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
interface IPinfo {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
}

$(
    function (): void {
        let ip: IPinfo = {ip: "::1",
                          hostname: "localhost.localdomain",
                          city: "Tucson",
                          region: "Arizona",
                          country: "US"};
        let onDataReceived = function(data: IPinfo): void { ip = data; };
        let displayIP = function(): void {
            $('#IPAddress').html(ip.ip)
            $('#HostName').html(ip.hostname)
            $('#userAgent').html(navigator.userAgent)
            $('#Location').html(ip.city + ", " + ip.region + ", " + ip.country)
        };
        // $.get("https://ipinfo.io", onDataReceived, "jsonp").always(displayIP);
        $.getJSON("https://ipinfo.io/json", {}, onDataReceived).always(displayIP);
    }
);
