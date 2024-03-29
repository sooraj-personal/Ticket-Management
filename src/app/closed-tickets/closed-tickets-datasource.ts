import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  description: string;
  id: number;
  priority: string;
  created_by: string;
  status: string;
  comment: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {id: 1, description: 'Test 1', priority: 'high', created_by: 'user', status: 'open', comment:'aaa'},
  {id: 2, description: 'Test 2', priority: 'low', created_by: 'user', status: 'open', comment:'bbb'},
  {id: 3, description: 'Test 3', priority: 'high', created_by: 'user', status: 'open', comment:'ccc'},
  {id: 4, description: 'Test 4', priority: 'high', created_by: 'user', status: 'open', comment:'ddd'},
  {id: 5, description: 'Test 5', priority: 'medium', created_by: 'user', status: 'open', comment:'eee'},
  {id: 6, description: 'Test 6', priority: 'high', created_by: 'user', status: 'open', comment:'fff'},
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'description': return compare(a.description, b.description, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'priority': return compare(a.priority, b.priority, isAsc);
        case 'comment': return compare(a.comment, b.comment, isAsc);

        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/description columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
