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
  protected readonly articleSearch = signal('');
  protected readonly selectedStatus = signal('');
  protected readonly selectedLocation = signal('');

  protected readonly items = computed(
    () => this.warehouseData.confirmedImport()?.data.items ?? [],
  );

  protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  });

  protected readonly filteredItems = computed(() => {
    const query = this.search().trim().toUpperCase();
    const articleQuery = this.articleSearch().trim().toUpperCase();
    const articles = this.articlesById();
    const status = this.selectedStatus();
    const location = this.selectedLocation();

    return this.items().filter(item => {
      const matchesSearch =
        item.hCode.toUpperCase().includes(query);

      const articleName =
        articles.get(item.articleId)?.articleName ?? '';

      const matchesArticle =
        articleName.toUpperCase().includes(articleQuery);

      const matchesStatus =
        status === '' || item.status === status;

      const matchesLocation =
        location === '' || item.locationCode === location;

      return (
        matchesSearch &&
        matchesArticle &&
        matchesStatus &&
        matchesLocation
      );
    });
  });

  protected readonly availableStatuses = computed(() => {
    const statuses = this.items()
      .map(item => item.status)
      .filter((status): status is string =>
        status !== null &&
        status !== undefined &&
        status !== ''
      );

    return [...new Set(statuses)]
      .sort((a, b) => a.localeCompare(b));
  });

  protected readonly availableArticles = computed(() => {
    const articles = [...this.articlesById().values()];

    return articles.sort((a, b) =>
      (a.articleName ?? '').localeCompare(b.articleName ?? '')
    );
  });
}



/*   protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  }); */