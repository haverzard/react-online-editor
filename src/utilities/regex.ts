export function matchOrEmpty(regex: RegExp, text: string) {
  return text.match(regex) || [];
}
