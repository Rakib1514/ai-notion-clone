function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // creates a simple hash from a string using bitwise operations
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // converts a number hash into a 6-digit hexadecimal color code
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default stringToColor;
