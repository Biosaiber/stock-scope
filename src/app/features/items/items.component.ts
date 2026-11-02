import { Component, computed, inject, signal } from '@angular/core';
import { WarehouseDataService } from '../../core/services/warehouse-data.service';

@Component({
  selector: 'app-items',
  imports: [],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {

  private readonly warehouseData = inject(WarehouseDataService);
  protected readonly search = signal('');
  

  protected readonly items = computed(
    () => this.warehouseData.confirmedImport()?.data.items ?? [],
  );

  protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  });

  protected readonly filteredItems = computed(() => {
    const query = this.search().trim().toLocaleUpperCase();

    return this.items().filter( item => item.hCode.toUpperCase().includes(query));
  })
}
