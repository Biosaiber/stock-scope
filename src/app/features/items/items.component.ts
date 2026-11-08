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
  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly selectedLocations = signal<string[]>([]);
  protected readonly isStatusFilterOpen = signal(false);
  protected readonly statusSearch = signal('');
  protected readonly locationSearch = signal('');
  protected readonly isLocationFilterOpen = signal(false);


  protected readonly items = computed(
    () => this.warehouseData.confirmedImport()?.data.items ?? [],
  );

  protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  });

  protected readonly itemsWithoutStatusFilter = computed(() => {
    const query = this.search().trim().toUpperCase();
    const articleQuery = this.articleSearch().trim().toUpperCase();
    const locations = this.selectedLocations();
    const articles = this.articlesById();

    return this.items().filter(item => {
      const articleName =
        articles.get(item.articleId)?.articleName ?? '';

      return (
        item.hCode.toUpperCase().includes(query) &&
        articleName.toUpperCase().includes(articleQuery) &&
        (locations.length === 0 ||
          locations.includes(item.locationCode ?? ''))
      );
    });
  });

  protected readonly itemsWithoutLocationFilter = computed(() => {
    const query = this.search().trim().toUpperCase();
    const articleQuery = this.articleSearch().trim().toUpperCase();
    const statuses = this.selectedStatuses();
    const articles = this.articlesById();

    return this.items().filter(item => {
      const articleName = articles.get(item.articleId)?.articleName ?? '';

      return (
        item.hCode.toUpperCase().includes(query) &&
        articleName.toUpperCase().includes(articleQuery) &&
        (statuses.length === 0 ||
          statuses.includes(item.status ?? ''))
      );
    });
  });

  protected readonly availableLocations = computed(() => {
    const locations = this.itemsWithoutLocationFilter()
      .map(item => item.locationCode)
      .filter((location): location is string =>
        location !== null &&
        location !== undefined &&
        location !== ''
      );

    return [...new Set(locations)]
      .sort((a, b) => a.localeCompare(b));
  })

  protected readonly visibleLocations = computed(() => {
    return [...new Set([
      ...this.availableLocations(),
      ...this.selectedLocations(),
    ])].sort((a, b) => a.localeCompare(b));
  })

  protected readonly searchedLocations = computed(() => {
    const query = this.locationSearch().trim().toUpperCase();
    return this.visibleLocations().filter(location =>
      location.toUpperCase().includes(query)
    );
  })

  protected readonly filteredItems = computed(() => {
    const statuses = this.selectedStatuses();

    return this.itemsWithoutStatusFilter().filter(item =>
      statuses.length === 0 ||
      statuses.includes(item.status ?? '')
    );
  });

  protected readonly availableStatuses = computed(() => {
    const statuses = this.itemsWithoutStatusFilter()
      .map(item => item.status)
      .filter((status): status is string =>
        status !== null &&
        status !== undefined &&
        status !== ''
      );

    return [...new Set(statuses)]
      .sort((a, b) => a.localeCompare(b));
  });

  protected readonly visibleStatuses = computed(() => {
    return [
      ...new Set([
        ...this.availableStatuses(),
        ...this.selectedStatuses(),
      ]),
    ].sort((a, b) => a.localeCompare(b));
  });

  protected readonly searchedStatuses = computed(() => {
    const query = this.statusSearch().trim().toLocaleUpperCase();

    return this.visibleStatuses().filter(status =>
      status.toUpperCase().includes(query)
    );
  })

  protected readonly availableArticles = computed(() => {
    const articles = [...this.articlesById().values()];

    return articles.sort((a, b) =>
      (a.articleName ?? '').localeCompare(b.articleName ?? '')
    );
  });

  protected toggleStatus(status: string): void {
    this.selectedStatuses.update(statuses => {
      if (statuses.includes(status)) {
        return statuses.filter(value => value !== status);
      }

      return [...statuses, status];
    });
  }

  protected toggleStatusFilter(): void {
    this.isStatusFilterOpen.update(isOpen => !isOpen);
  }

  protected selectAllStatusResults(): void {
    const results = this.searchedStatuses();

    this.selectedStatuses.update(selected =>
      [...new Set([...selected, ...results])]
    )
  }

  protected clearStatusFilter(): void {
    this.selectedStatuses.set([]);
  }

  protected closeStatusFilter(): void {
    this.isStatusFilterOpen.set(false);
  }

  protected toggleLocation(location: string): void {
    this.selectedLocations.update(locations => {
      if (locations.includes(location)) {
        return locations.filter(value => value !== location);
      }

      return [...locations, location];
    });
  }

  protected toggleLocationFilter(): void {
    this.isLocationFilterOpen.update(isOpen => !isOpen);
  }

  protected closeLocationFilter(): void {
    this.isLocationFilterOpen.set(false);
  }

  protected selectAllLocationResults(): void {
  const results = this.searchedLocations();

  this.selectedLocations.update(selected =>
    [...new Set([...selected, ...results])]
  );
}

protected clearLocationFilter(): void {
  this.selectedLocations.set([]);
}


}