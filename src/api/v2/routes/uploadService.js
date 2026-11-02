export async function uploadToUploadcare(buffer, mimetype) {
  // Simula o upload e retorna uma URL válida para o arquivo enviado
  return `https://ucarecdn.com/mock-upload-${Date.now()}/file.jpg`;
}