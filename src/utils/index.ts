export function titleCase(str: string | undefined): string {
  return str === undefined ? "" : str.charAt(0).toUpperCase() + str.slice(1);
}
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
