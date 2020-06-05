//
// Implement +-*/
// Immutable?  Would need to make attributes private.
//
class LongInteger {
    public negative: boolean;
    public digits: number[];
    constructor(input: any) {
        if (input instanceof LongInteger) {
            this.negative = input.negative;
            this.digits = input.digits.slice();
            return;
        }
        //
        // Simple check for valid integer.
        // Side-effect: input converted to string.
        //
        let si = (input += "").replace(/[^\d.-]/g, "");
        if (si.indexOf(".") >= 0)
            throw new Error("Invalid integer: " + si);
        //
        // Determine the sign of the number.  true denotes negative.
        //
        this.negative = si.charAt(0) == "-";
        //
        // Extract digits into array.
        //
        let d = si.replace(/[^\d]/g, "").replace(/^0*/, "");
        this.digits = [];
        for (let i = 0; i < d.length; i++) this.digits[i] = +d[i];
    }
    increment(): LongInteger {
        if (this.compare(0) < 0) return this.abs().decrement().negate();
        let ii: number[] = this.digits.slice();
        let i: number = this.digits.length - 1;
        while (i >= 0) {
            ii[i]++;
            if (ii[i] == 10) {
                ii[i] = 0;
                i--;
                if (i == -1) ii.unshift(1);
            } else {
                break;
            }
        }
        return new LongInteger(ii.join(""))
    }
    decrement(): LongInteger {
        if (this.compare(0) < 0) return this.abs().increment().negate();

    }
    add(other: any): LongInteger {
        let o = new LongInteger(other);
        if (this.compare(0) == 0) return o;
        if (o.compare(0) == 0) return this;
        if (this.negative && o.negative) return this.abs().add(o.abs()).negate();
        if (this.negative) return this.abs().subtract(o).negate();
        if (o.negative) return this.subtract(o.abs);
        let carry: number = 0;
        let a: number[] = [];
        for (let i = this.digits.length - 1, j = this.digits.length - 1; (i >= 0) && (j >= 0); i--, j--) {
            let sum: number = this.digits[i] + this.digits[j] + carry;
            if (sum >= 10) {
                carry = 1;
                sum -= 10;
            } else {
                carry = 0;
            }
            a.unshift(sum);
        }
        if (carry) a.unshift(carry);
        return new LongInteger(a.join(""));
    }
    subtract(other: any): LongInteger {
        let o = new LongInteger(other);
        if (this.negative != o.negative) return this.add(o.negate());
        return this;
    }
    multiply(other: any): LongInteger {
        let o = new LongInteger(other);
        if (this.compare(0) == 0 || o.compare(1) == 0) return this;
        if (this.compare(1) == 0 || o.compare(0) == 0) return o;
        let t: LongInteger = this.abs();
        let m = new LongInteger(0);
        let i: number = 0;
        while (o.compare(i) != 0) {
            m = m.add(t);
            i += 1;
        }
        if ((this.negative && o.negative) || (!this.negative && !o.negative))
            return m; // Result is positive.
        return m.negate();
    }
    divide(other: any): LongInteger {
        let o = new LongInteger(other);
        if (other.compare(0) == 0) throw new Error("Division by zero!");
        if (this.compare(o) == 0) return new LongInteger(1);
        if (this.compare(o.negate()) == 0) return new LongInteger(-1);
        let r = new LongInteger(this.abs());
        let oo: LongInteger = o.abs();
        let d = new LongInteger(0);
        while (r.compare(oo) > 0) {
            r = r.subtract(oo);
            d = d.add(1);
        }
        if ((this.negative && o.negative) || (!this.negative && !o.negative))
            return d; // Result is positive.
        // return d.negate().subtract(1);
    }
    mod(other: any): LongInteger {
        return this.subtract(this.divide(other).multiply(other));
    }
    compare(other: any): number {
        let o = new LongInteger(other);
        //
        // Do they differ in sign?
        //
        if (this.negative != o.negative) return this.negative ? -1 : 1;
        //
        // Same sign, which one has more digits?
        //
        if (this.digits.length != o.digits.length) {
            if (this.negative) {
                return this.digits.length > o.digits.length ? -1 : 1;
            } else {
                return this.digits.length > o.digits.length ? 1 : -1;
            }
        }
        //
        // Same sign and number of digits.  Compare digit-by-digit.
        //
        for (let i = 0; i < this.digits.length; i++) {
            if (this.digits[i] != o.digits[i]) {
                if (this.negative) {
                    return this.digits[i] > o.digits[i] ? -1 : 1;
                } else {
                    return this.digits[i] > o.digits[i] ? 1 : -1;
                }

            }
        }
        return 0;
    }
    negate(): LongInteger {
        let n = new LongInteger(this);
        n.negative = !n.negative;
        return n;
    }
    abs(): LongInteger {
        let n = new LongInteger(this);
        n.negative = false;
        return n;
    }
    pow(power: any): LongInteger {
        let p = new LongInteger(power);
        let o = new LongInteger(1);
        if (p.compare(0) == 0) return o;
        while (p.compare(0)) {
            o = o.multiply(this);
            p.subtract(1);
        }
        return o;
    }
    factorial(): LongInteger {
        if (this.negative) throw new Error("Factorial of negative number!");
        if (this.compare(0) == 0) return new LongInteger(1);
        return this.multiply(this.subtract(1).factorial());
    }
    toString(): string {
        return this.negative ? "-" : "" + this.digits.join("");
    }
    valueOf(): string {
        return this.negative ? "-" : "" + this.digits.join("");
    }
    toBase(base: number): string {
        //
        // Only converts up to hex.
        //
        let remainders: string[];
        if (this.compare(0) === 0) {
            remainders = ['0'];
        } else {
            let n = new LongInteger(this);
            remainders = [];
            let hex_table = '0123456789abcdef';
            while (n.compare(0)) {
                remainders.unshift(hex_table.charAt(parseInt(n.mod(base).toString())));
                n = n.divide(base);
            }
        }
        return remainders.join('');
    }
}
try {
    let bad = new LongInteger(3.14159);
} catch (e) {
    console.error(e);
}
let zero = new LongInteger(0);
let one = new LongInteger(1);
let test = new LongInteger(9999);
console.log(test.increment().toString());
console.log(test.increment().increment().toString());
// console.log(test.decrement().toString());
test = new LongInteger(9);
console.log(test.increment().toString());
let test2 = new LongInteger(test);
console.log(test2.compare(test));
console.log(test.add(test2).toString());
console.log(test2.add(0).toString());
console.log(zero.add(test2).toString());
// let test3 = new LongInteger(18446744073709551615); // 2**64 - 1
// console.log(test3.toBase(16));
