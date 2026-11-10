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
  protected readonly selectedArticles = signal<string[]>([]);
  protected readonly isArticleFilterOpen = signal(false);

  protected readonly statusSearch = signal('');
  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly isStatusFilterOpen = signal(false);

  protected readonly locationSearch = signal('');
  protected readonly selectedLocations = signal<string[]>([]);
  protected readonly isLocationFilterOpen = signal(false);


  protected readonly items = computed(
    () => this.warehouseData.confirmedImport()?.data.items ?? [],
  );

  protected readonly articlesById = computed(() => {
    const articles =
      this.warehouseData.confirmedImport()?.data.articles ?? [];

    return new Map(articles.map(article => [article.id, article]));
  });

  protected readonly itemsWithoutArticleFilter = computed(() => {
    const query = this.search().trim().toUpperCase();
    const locations = this.selectedLocations();
    const statuses = this.selectedStatuses();

    return this.items().filter(item => {
      return (
        item.hCode.toUpperCase().includes(query) &&
        (statuses.length === 0 ||
          statuses.includes(item.status ?? '')) &&
        (locations.length === 0 ||
          locations.includes(item.locationCode ?? ''))
      );
    });
  });

  protected readonly itemsWithoutStatusFilter = computed(() => {
    const query = this.search().trim().toUpperCase();
    const articleIds = this.selectedArticles();
    const locations = this.selectedLocations();

    return this.items().filter(item => {
      return (
        item.hCode.toUpperCase().includes(query) &&
        (articleIds.length === 0 ||
          articleIds.includes(item.articleId)) &&
        (locations.length === 0 ||
          locations.includes(item.locationCode ?? ''))
      );
    });
  });

  protected readonly itemsWithoutLocationFilter = computed(() => {
    const query = this.search().trim().toUpperCase();
    const articleIds = this.selectedArticles();
    const statuses = this.selectedStatuses();


    return this.items().filter(item => {
      return (
        item.hCode.toUpperCase().includes(query) &&
        (articleIds.length === 0 ||
          articleIds.includes(item.articleId)) &&
        (statuses.length === 0 ||
          statuses.includes(item.status ?? ''))
      );
    });
  });

  protected readonly availableArticles = computed(() => {
    const articles = this.itemsWithoutArticleFilter()
      .map(item => item.articleId)
      .filter((article): article is string =>
        article !== null &&
        article !== undefined &&
        article !== ''
      );
    return [...new Set(articles)]
      .sort((a, b) => a.localeCompare(b));
  });

  protected readonly visibleArticles = computed(() => {
    const articles = this.articlesById();

    return [...new Set([
      ...this.availableArticles(),
      ...this.selectedArticles(),
    ])].sort((a, b) => {
      const nameA = articles.get(a)?.articleName ?? '';
      const nameB = articles.get(b)?.articleName ?? '';

      return nameA.localeCompare(nameB);
    });
  });

  protected readonly searchedArticles = computed(() => {
    const query = this.articleSearch().trim().toUpperCase();
    const articles = this.articlesById();
    return this.visibleArticles().filter(articleId => {
      const name = articles.get(articleId)?.articleName ?? '';

      return name.toUpperCase().includes(query);
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
  });

  protected readonly visibleLocations = computed(() => {
    return [...new Set([
      ...this.availableLocations(),
      ...this.selectedLocations(),
    ])].sort((a, b) => a.localeCompare(b));
  });

  protected readonly searchedLocations = computed(() => {
    const query = this.locationSearch().trim().toUpperCase();
    return this.visibleLocations().filter(location =>
      location.toUpperCase().includes(query)
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
    const query = this.statusSearch().trim().toUpperCase();

    return this.visibleStatuses().filter(status =>
      status.toUpperCase().includes(query)
    );
  });

  protected readonly filteredItems = computed(() => {
    const statuses = this.selectedStatuses();

    return this.itemsWithoutStatusFilter().filter(item =>
      statuses.length === 0 ||
      statuses.includes(item.status ?? '')
    );
  });

  protected toggleArticle(article: string): void {
    this.selectedArticles.update(articles => {
      if (articles.includes(article)) {
        return articles.filter(value => value !== article);
      }

      return [...articles, article];
    });
  }

  protected toggleArticleFilter(): void {
    this.isArticleFilterOpen.update(isOpen => !isOpen);
  };

  protected selectAllArticleResults(): void {
    const results = this.searchedArticles();

    this.selectedArticles.update(selected =>
      [...new Set([...selected, ...results])]
    )
  }

  protected clearArticleFilter(): void {
    this.selectedArticles.set([]);
  }

  protected closeArticleFilter(): void {
    this.isArticleFilterOpen.set(false);
  }

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