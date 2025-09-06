export interface Base64File {
  data: string;
  mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is in format "data:image/jpeg;base64,..."
      const [header, data] = result.split(',');
      if (!header || !data) {
        return reject(new Error("Invalid file format"));
      }
      const mimeType = header.split(':')[1].split(';')[0];
      resolve({ data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

export const dataUrlToBase64File = (dataUrl: string): Base64File => {
  const [header, data] = dataUrl.split(',');
  if (!header || !data) {
    throw new Error("Invalid data URL format");
  }
  const mimeTypeMatch = header.match(/:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';
  
  return { data, mimeType };
};
