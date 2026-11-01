import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { WarehouseDataService } from './warehouse-data.service';

describe('WarehouseDataService', () => {
  let service: WarehouseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(WarehouseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
