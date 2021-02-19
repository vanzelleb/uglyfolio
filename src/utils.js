export function toLocaleNumber(value, digits) {
  if (isNaN(parseFloat(value))) return value;
  value = value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  return value;
}

export const today = new Date().toISOString().substring(0, 10);

export const timestamp = (date) => {
  date = date ? new Date(date) : new Date();
  return (date.getTime() / 1000) | 0;
};

// green color
export const posColor = "#1B998B";
// red color
export const negColor = "#FF4560";
