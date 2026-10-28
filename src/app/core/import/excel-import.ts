import { readExcelLocationRows } from './excel-import.reader';

export async function importExcel(file: File) {
  return readExcelLocationRows(file);
}