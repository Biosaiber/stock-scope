import { Component, computed, inject } from '@angular/core';
import { WarehouseDataService } from '../../core/services/warehouse-data.service';

@Component({
  selector: 'app-items',
  imports: [],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  private readonly warehouseData = inject(WarehouseDataService);

  protected readonly items = computed(
    () => this.warehouseData.confirmedImport()?.data.items ?? [],
  );

  protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  });
}
