import { User, File as FileEntity } from '@/generated/prisma/client';
import fontkit from '@pdf-lib/fontkit';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';

export async function uploadFile(
  file: File | { name: string; data: Buffer },
  user: User | string
): Promise<string> {
  const userId = typeof user === 'string' ? user : user.id;
  const key = `${userId}-${Date.now()}-${file.name.replaceAll(' ', '_')}`;

  const fileBuffer =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file.data;
  const path = join(process.cwd(), 'uploads', key);
  await writeFile(path, fileBuffer);

  return key;
}

export async function signDocument(
  document: FileEntity,
  signature: FileEntity
) {
  if (document.mimeType !== 'application/pdf') {
    return null;
  }

  const [documentBytes, signatureBytes, fontBytes] = await Promise.all([
    readFile('./uploads/' + document.key),
    readFile('./uploads/' + signature.key),
    readFile('./public/font.ttf'),
  ]);

  const pdfDoc = await PDFDocument.load(documentBytes);
  const [page] = pdfDoc.getPages();

  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(fontBytes);
  const image = await pdfDoc.embedPng(signatureBytes);
  const { width: imgWidth, height: imgHeight } = image.scaleToFit(100, 100);

  const now = new Date();

  const { width: pageWidth } = page.getSize();

  // Draw Signature
  const signX = pageWidth - imgWidth - 10;
  const signY = 50;
  page.drawImage(image, {
    x: signX,
    y: signY,
    width: imgWidth,
    height: imgHeight,
    opacity: 0.9,
  });

  // Draw date below signature
  const dateText = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const dateTextWidth = font.widthOfTextAtSize(dateText, 12);
  page.drawText(dateText, {
    x: signX + imgWidth / 2 - dateTextWidth / 2,
    y: signY - 10,
    size: 12,
    font: font,
  });

  // Draw time below signature
  const timeText =
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0');
  const timeTextWidth = font.widthOfTextAtSize(timeText, 12);
  page.drawText(timeText, {
    x: signX + imgWidth / 2 - timeTextWidth / 2,
    y: signY - 22,
    size: 12,
    font: font,
  });

  return pdfDoc.save();
}
