import { readExcelLocationRows } from './excel-import.reader';

async function getFingerprint(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buffer);

  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function importExcel(file: File) {
  const fileFingerprint = await getFingerprint(
    await file.arrayBuffer(),
  );

  const result = await readExcelLocationRows(file);

  const normalizedRows = result.sourceRows.map(source =>
    JSON.stringify(
      source.cells.map(value => {
        if (value === null || value === undefined) {
          return null;
        }

        if (typeof value === 'string') {
          return value.trim() || null;
        }

        return value;
      }),
    ),
  );

  normalizedRows.sort();

  const dataBuffer = new TextEncoder().encode(
    JSON.stringify(normalizedRows),
  );

  const dataFingerprint = await getFingerprint(dataBuffer.buffer);

  return {
    ...result,
    fileFingerprint,
    dataFingerprint,
  };
}