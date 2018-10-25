export class Angle {
  static readonly RE_DMS = new RegExp(
    '^\\s*(-?\\d+)(?:\\.(\\d+)?|(?:[*° ](60|[0-5]?\\d)(?:[ \'](60|[0-5]?\\d(?:\\.\\d{0,6})?)"?)?)?)\\s*$');
  static readonly RE_LAT = new RegExp(
    '^\\s*(-?\\d+)(?:\\.(\\d+)?|(?:[*° ](60|[0-5]?\\d)(?:[ \'](60|[0-5]?\\d(?:\\.\\d{0,6})?|\\d(?:.\\d+)?E-\\d+)"?)?)?([NS])?)\\s*$');
  static readonly RE_LON = new RegExp(
    '^\\s*(-?\\d+)(?:\\.(\\d+)?|(?:[*° ](60|[0-5]?\\d)(?:[ \'](60|[0-5]?\\d(?:\\.\\d{0,6})?|\\d(?:.\\d+)?E-\\d+)"?)?)?([WE])?)\\s*$');

  static RAD_DEGREE = 0.01745329251994328;

  static π = 3.1415926535897931;

  static πx2 = 2.0 * Angle.π;

  static angle(x1: number, y1: number, x2: number, y2: number): number {
    let angle = Math.atan2(x2 - x1, y2 - y1);
    if (angle < 0) {
      angle += Angle.πx2;
    }
    return angle;
  }

  static angleDegrees(x1: number, y1: number, x2: number, y2: number): number {
    const angle = Angle.angle(x1, y1, x2, y2);
    return Angle.toDegrees(angle);
  }


  static equalDms(a: string, b: string, minDiff: number = 0, regEx = Angle.RE_DMS): boolean {
    if (a === b) {
      return true;
    } else {
      const dms1 = Angle.dmsParts(a, regEx);
      const dms2 = Angle.dmsParts(b, regEx);
      if (dms1[0] === dms2[0]) {
        if (dms1[1] === dms2[1]) {
          const second1 = dms1[2];
          const second2 = dms2[2];
          const diff = Math.abs(second1 - second2);
          if (diff < minDiff || minDiff === 0 && diff === 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static toCompass(degrees: number): number {
    return (450 - degrees) % 360;
  }

  static toCartesian(degrees: number): number {
    return (450 - degrees) % 360;
  }

  static toRadians(degrees: number): number {
    return degrees * Angle.π / 180;
  }

  static toDegrees360(radians: number): number {
    const degrees = radians * 180 / Math.PI;
    if (degrees < 0) {
      return 360 + degrees;
    } else {
      return degrees;
    }
  }

  static toDegrees(radians: number): number {
    return radians * 180.0 / Angle.π;
  }

  static toDecimalDegrees(dms: any, regEx = Angle.RE_DMS): number {
    if (dms) {
      const dmsString = dms.toString().trim();
      const match = dmsString.match(regEx);
      if (match) {
        const degrees = match[1];
        const decimal = match[2];
        if (decimal) {
          return parseFloat(degrees + '.' + decimal);
        } else {
          const minutes = match[3];
          const seconds = match[4];
          const direction = match[5];
          let negative = direction === 'S' || direction === 'W';
          let result = parseFloat(degrees);
          if (result < 0) {
            negative = true;
            result = -result;
          }

          if (minutes) {
            result += parseFloat(minutes) / 60;
          }
          if (seconds) {
            result += parseFloat(seconds) / 3600;
          }

          if (negative) {
            return -result;
          } else {
            return result;
          }
        }
      }
    }
    return null;
  }

  static dmsParts(dms: any, regEx = Angle.RE_DMS): number[] {
    if (dms) {
      const dmsString = dms.toString().trim();
      const match = dmsString.match(regEx);
      if (match) {
        const degrees = match[1];
        const decimal = match[2];
        if (decimal) {
          const degree = Number(degrees);
          const minute = Math.floor(Number(decimal) * 60) % 60;
          const second = (Number(decimal) * 3600) % 60;
          return new Array(degree, minute, second);
        } else {
          const minutes = match[3];
          const seconds = match[4];
          const direction = match[5];
          const negative = direction === 'S' || direction === 'W';
          let degree = parseFloat(degrees);
          if (negative && degree > 0) {
            degree = -degree;
          }
          let minute: number;
          if (minutes) {
            minute = parseFloat(minutes);
          } else {
            minute = 0;
          }
          let second: number;
          if (seconds) {
            second = parseFloat(seconds);
          } else {
            second = 0;
          }

          return new Array(degree, minute, second);
        }
      }
    }
    return null;
  }

  static toDegreesMinutesSeconds(angle: any, secondsDecimalPlaces?: number): string {
    let text = '';
    if (angle < 0) {
      text = '-';
      angle = -angle;
    }
    let degrees = Math.floor(angle);
    let minutes = Math.floor(angle * 60) % 60;
    let seconds = angle * 3600 % 60;
    if (secondsDecimalPlaces !== undefined) {
      if (parseFloat(seconds.toFixed(secondsDecimalPlaces)) >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          degrees++;
        }
      }
    }

    text += degrees;
    text += ' ';
    if (minutes < 10) {
      text += '0';
    }
    text += minutes;
    text += ' ';
    if (seconds < 10) {
      text += '0';
    }
    if (secondsDecimalPlaces === undefined) {
      text += seconds;
    } else {
      text += seconds.toFixed(secondsDecimalPlaces);
    }
    return text;
  }

  static toDegreesMinutesSecondsLat(angle: any, secondsDecimalPlaces?: number): string {
    if (angle < 0) {
      return this.toDegreesMinutesSeconds(-angle, secondsDecimalPlaces) + 'S';
    } else {
      return this.toDegreesMinutesSeconds(angle, secondsDecimalPlaces) + 'N';
    }
  }

  static toDegreesMinutesSecondsLon(angle: any, secondsDecimalPlaces?: number): string {
    if (angle < 0) {
      return this.toDegreesMinutesSeconds(-angle, secondsDecimalPlaces) + 'W';
    } else {
      return this.toDegreesMinutesSeconds(angle, secondsDecimalPlaces) + 'E';
    }
  }
}
