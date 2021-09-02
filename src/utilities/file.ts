export function genUniqueName(list: Array<string>, name: string) {
  let newName = name;
  if (list.includes(newName)) {
    // iterate until no duplicates
    let duplicates = 1;
    while (list.includes(newName + `_${duplicates}`)) {
      duplicates++;
    }
    newName += `_${duplicates}`;
  }
  return newName;
}
