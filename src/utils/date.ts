export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthString: string = month < 10 ? "0" + month : "" + month;
  const day = date.getDate();
  const dayString: string = day < 10 ? "0" + day : "" + day;
  return `${year}-${monthString}-${dayString}`;
}
