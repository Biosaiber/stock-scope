import { readExcelLocationRows } from './excel-import.reader';

async function getFileFingerprint(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buffer);

  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function importExcel(file: File) {
  const fileFingerprint = await getFileFingerprint(file);
  const result = await readExcelLocationRows(file);

  return {
    ...result,
    fileFingerprint,
  };
}