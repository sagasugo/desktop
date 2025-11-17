export function titleCase(str: string | undefined): string {
  return str === undefined ? "" : str.charAt(0).toUpperCase() + str.slice(1);
}
