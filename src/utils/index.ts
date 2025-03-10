export const replaceAllSpacesByUnderlines = (
  text: string,
  lowerCase: boolean = true,
) => {
  let result = text.replace(new RegExp(" ", "g"), "_");
  if (lowerCase) result.toLowerCase();
  return result;
};

export const getImageThumbnail = (
  imagePathAndName: string,
  thumbSize: number,
) => {
  const splitPath = imagePathAndName.split("/");
  const [fileName, fileExtension] = splitPath[splitPath.length - 1].split(".");
  return `${splitPath
    .slice(0, splitPath.length - 1)
    .join("/")}/${fileName}_${thumbSize}x${thumbSize}.${fileExtension}`;
};

export const buildPaymentsAuthHeadersApiKey = () => ({
  "py-api-key": process.env.PAYMENTS_API_KEY,
});
