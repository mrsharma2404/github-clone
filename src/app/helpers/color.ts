// Function to get contrasting text color (black or white) based on background
export function getContrastYIQ(hexColor: string) {
  const r = parseInt(hexColor.slice(0, 2), 16); // Use slice instead of substr
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
}
// Function to darken the color for border
export function darkenColor(hexColor: string, amount = 20) {
  const num = parseInt(hexColor, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max((num & 0x0000ff) - amount, 0);
  const b = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  return `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
}
