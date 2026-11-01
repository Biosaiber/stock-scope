import { Injectable, signal } from '@angular/core';
import type { importExcel } from '../import/excel-import';
import type { ExcelImportResult } from '../import/excel-import-result.model';

type ConfirmedWarehouseImport = {
  source: Awaited<ReturnType<typeof importExcel>>;
  data: ExcelImportResult;
};

@Injectable({
  providedIn: 'root',
})
export class WarehouseDataService {
  private readonly confirmedImportState =
    signal<ConfirmedWarehouseImport | null>(null);

  readonly confirmedImport = this.confirmedImportState.asReadonly();

  confirmImport(result: ConfirmedWarehouseImport): void {
    this.confirmedImportState.set(result);
  }
}