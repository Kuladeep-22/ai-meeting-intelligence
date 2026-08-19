export const capitalize = (
  text: string
) => {
  if (!text) return "";

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

export const truncate = (
  text: string,
  length = 50
) => {
  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + "...";
};

export const generateRandomId = () => {
  return Math.floor(
    Math.random() * 1000000
  );
};