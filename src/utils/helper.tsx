export const encodeBase64 = (url:string) => {
    return btoa(url); // Encodes the string to Base64
  };
  
  // Decode a Base64 string
export const decodeBase64 = (encoded:string) => {
return atob(encoded); // Decodes the Base64 string
};