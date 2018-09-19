export class Measures {
  count = 0;

  sum = 0;

  min = Number.MAX_VALUE;

  max = 0;

  counts: {[value: number]: number} = {};

  constructor(private scaleFactor?: number) {
  }
  addValue(value: number) {
    if (this.scaleFactor) {
      value = Math.round(value * this.scaleFactor) / this.scaleFactor;
    }
    let count = this.counts[value];
    if (count) {
      count++;
    } else {
      count = 1;
    }
    this.counts[value] = count;
    this.count++;
    this.sum += value;
    if (value < this.min) {
      this.min = value;
    }
    if (value > this.max) {
      this.max = value;
    }
  }

  get average(): number {
    return this.sum / this.count;
  }

  toString(): string {
    let s = `{count:${this.count},min:${this.min},max:${this.max},average:${this.average},counts:{`;
    let first = true;
    const keys = Object.keys(this.counts);
    keys.sort();
    for (const k of keys) {
      if (first) {
        first = false;
      } else {
        s += ',';
      }
      s += `'${k}': ${this.counts[k]}`;
    }
    return s + '}';
  }
}
