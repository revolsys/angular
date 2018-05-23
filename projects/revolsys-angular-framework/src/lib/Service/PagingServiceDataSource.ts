import {
  BehaviorSubject,
  Observable,
  of
} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {DataSource} from '@angular/cdk/table';
import {Service} from './Service';
import {ArrayDataSource} from './ArrayDataSource';

export class PagingServiceDataSource<T> extends ArrayDataSource<T> {

  constructor(private service: Service<T>) {
    super();
  }

  loadPage(offset: number, pageSize: number, path?: string, filter?: {[fieldName: string]: string}) {
    const loadingIndex = this.startLoading();
    this.service.getRowsPage(offset, pageSize, path, filter).pipe(
      catchError(() => of([])),
      finalize(() => this.stopLoading(loadingIndex))
    ).subscribe(result => this.setRecords(result.rows, result.count, loadingIndex));
  }
}