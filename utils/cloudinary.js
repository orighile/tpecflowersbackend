export const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts.pop(); 
  const folder = parts.pop();   

  const publicId = `${folder}/${filename.split(".")[0]}`; 
  return publicId;
};
