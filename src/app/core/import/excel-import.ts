import { readExcelLocationRows } from './excel-import.reader';


function getReportDate(fileName: string): string | null {
  const match = /^report_location_(\d{2})(\d{2})(\d{2})(?:-\d{4})?(?:\(\d+\))?\.xlsx$/i
    .exec(fileName);

  if (!match) {
    return null;
  }

  const year = 2000 + Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

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
  const reportDate = getReportDate(file.name);

  return {
    ...result,
    fileFingerprint,
    dataFingerprint,
    reportDate,
  };
}