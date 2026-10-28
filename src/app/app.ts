import { Component, signal } from '@angular/core';
import { importExcel } from './core/import/excel-import';
import type { ExcelImportResult } from './core/import/excel-import-result.model';
import { mapRowsToImportResult } from './core/import/excel-import.adapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly isImporting = signal(false);
  protected readonly importResult = signal<ExcelImportResult | null>(null);
  protected readonly importPreview = signal<Awaited<ReturnType<typeof importExcel>> | null>(null);
  protected readonly importError = signal<string | null>(null);

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || this.isImporting()) {
      return;
    }

    this.isImporting.set(true);
    this.importError.set(null);

    try {
      const result = await importExcel(file);

      this.importPreview.set(result);
    } catch (error: unknown) {
      this.importError.set(
        error instanceof Error ? error.message : 'Excel import failed.',
      );
    } finally {
      this.isImporting.set(false);
      input.value = '';
    }
  }
  protected confirmImport(): void {
    const preview = this.importPreview();

    if (!preview || preview.issues.length > 0) {
      return;
    }

    this.importError.set(null);

    try {
      const result = mapRowsToImportResult(preview.rows);

      this.importResult.set(result);
      this.importPreview.set(null);
    } catch (error: unknown) {
      this.importError.set(
        error instanceof Error ? error.message : 'Excel import failed.',
      );
    }
  }

  protected cancelImport(): void {
    this.importPreview.set(null);
    this.importError.set(null);
  }
}