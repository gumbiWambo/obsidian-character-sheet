export function numberToSignedString(number: number): string {
    return number >= 0 ? `+${number.toString()}` : number.toString();
  }