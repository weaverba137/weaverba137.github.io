var LongInteger = (function () {
    function LongInteger(input) {
        if (input instanceof LongInteger) {
            this.negative = input.negative;
            this.digits = input.digits.slice();
            return;
        }
        var si = (input += "").replace(/[^\d.-]/g, "");
        if (si.indexOf(".") >= 0)
            throw new Error("Invalid integer: " + si);
        this.negative = si.charAt(0) == "-";
        var d = si.replace(/[^\d]/g, "").replace(/^0*/, "");
        this.digits = [];
        for (var i = 0; i < d.length; i++)
            this.digits[i] = +d[i];
    }
    LongInteger.prototype.increment = function () {
        if (this.compare(0) < 0)
            return this.abs().decrement().negate();
        var ii = this.digits.slice();
        var i = this.digits.length - 1;
        while (i >= 0) {
            ii[i]++;
            if (ii[i] == 10) {
                ii[i] = 0;
                i--;
                if (i == -1)
                    ii.unshift(1);
            }
            else {
                break;
            }
        }
        return new LongInteger(ii.join(""));
    };
    LongInteger.prototype.decrement = function () {
        if (this.compare(0) < 0)
            return this.abs().increment().negate();
    };
    LongInteger.prototype.add = function (other) {
        var o = new LongInteger(other);
        if (this.compare(0) == 0)
            return o;
        if (o.compare(0) == 0)
            return this;
        if (this.negative && o.negative)
            return this.abs().add(o.abs()).negate();
        if (this.negative)
            return this.abs().subtract(o).negate();
        if (o.negative)
            return this.subtract(o.abs);
        var carry = 0;
        var a = [];
        for (var i = this.digits.length - 1, j = this.digits.length - 1; (i >= 0) && (j >= 0); i--, j--) {
            var sum = this.digits[i] + this.digits[j] + carry;
            if (sum >= 10) {
                carry = 1;
                sum -= 10;
            }
            else {
                carry = 0;
            }
            a.unshift(sum);
        }
        if (carry)
            a.unshift(carry);
        return new LongInteger(a.join(""));
    };
    LongInteger.prototype.subtract = function (other) {
        var o = new LongInteger(other);
        if (this.negative != o.negative)
            return this.add(o.negate());
        return this;
    };
    LongInteger.prototype.multiply = function (other) {
        var o = new LongInteger(other);
        if (this.compare(0) == 0 || o.compare(1) == 0)
            return this;
        if (this.compare(1) == 0 || o.compare(0) == 0)
            return o;
        var t = this.abs();
        var m = new LongInteger(0);
        var i = 0;
        while (o.compare(i) != 0) {
            m = m.add(t);
            i += 1;
        }
        if ((this.negative && o.negative) || (!this.negative && !o.negative))
            return m;
        return m.negate();
    };
    LongInteger.prototype.divide = function (other) {
        var o = new LongInteger(other);
        if (other.compare(0) == 0)
            throw new Error("Division by zero!");
        if (this.compare(o) == 0)
            return new LongInteger(1);
        if (this.compare(o.negate()) == 0)
            return new LongInteger(-1);
        var r = new LongInteger(this.abs());
        var oo = o.abs();
        var d = new LongInteger(0);
        while (r.compare(oo) > 0) {
            r = r.subtract(oo);
            d = d.add(1);
        }
        if ((this.negative && o.negative) || (!this.negative && !o.negative))
            return d;
    };
    LongInteger.prototype.mod = function (other) {
        return this.subtract(this.divide(other).multiply(other));
    };
    LongInteger.prototype.compare = function (other) {
        var o = new LongInteger(other);
        if (this.negative != o.negative)
            return this.negative ? -1 : 1;
        if (this.digits.length != o.digits.length) {
            if (this.negative) {
                return this.digits.length > o.digits.length ? -1 : 1;
            }
            else {
                return this.digits.length > o.digits.length ? 1 : -1;
            }
        }
        for (var i = 0; i < this.digits.length; i++) {
            if (this.digits[i] != o.digits[i]) {
                if (this.negative) {
                    return this.digits[i] > o.digits[i] ? -1 : 1;
                }
                else {
                    return this.digits[i] > o.digits[i] ? 1 : -1;
                }
            }
        }
        return 0;
    };
    LongInteger.prototype.negate = function () {
        var n = new LongInteger(this);
        n.negative = !n.negative;
        return n;
    };
    LongInteger.prototype.abs = function () {
        var n = new LongInteger(this);
        n.negative = false;
        return n;
    };
    LongInteger.prototype.pow = function (power) {
        var p = new LongInteger(power);
        var o = new LongInteger(1);
        if (p.compare(0) == 0)
            return o;
        while (p.compare(0)) {
            o = o.multiply(this);
            p.subtract(1);
        }
        return o;
    };
    LongInteger.prototype.factorial = function () {
        if (this.negative)
            throw new Error("Factorial of negative number!");
        if (this.compare(0) == 0)
            return new LongInteger(1);
        return this.multiply(this.subtract(1).factorial());
    };
    LongInteger.prototype.toString = function () {
        return this.negative ? "-" : "" + this.digits.join("");
    };
    LongInteger.prototype.valueOf = function () {
        return this.negative ? "-" : "" + this.digits.join("");
    };
    LongInteger.prototype.toBase = function (base) {
        var remainders;
        if (this.compare(0) === 0) {
            remainders = ['0'];
        }
        else {
            var n = new LongInteger(this);
            remainders = [];
            var hex_table = '0123456789abcdef';
            while (n.compare(0)) {
                remainders.unshift(hex_table.charAt(parseInt(n.mod(base).toString())));
                n = n.divide(base);
            }
        }
        return remainders.join('');
    };
    return LongInteger;
}());
try {
    var bad = new LongInteger(3.14159);
}
catch (e) {
    console.error(e);
}
var zero = new LongInteger(0);
var one = new LongInteger(1);
var test = new LongInteger(9999);
console.log(test.increment().toString());
console.log(test.increment().increment().toString());
test = new LongInteger(9);
console.log(test.increment().toString());
var test2 = new LongInteger(test);
console.log(test2.compare(test));
console.log(test.add(test2).toString());
console.log(test2.add(0).toString());
console.log(zero.add(test2).toString());
