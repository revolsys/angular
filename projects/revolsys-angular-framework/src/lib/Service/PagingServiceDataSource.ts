import {
  of
} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Service} from './Service';
import {ArrayDataSource} from './ArrayDataSource';
import { Sort } from '@angular/material';

export class PagingServiceDataSource<T> extends ArrayDataSource<T> {

  constructor(private service: Service<T>) {
    super();
  }

  loadPage(offset: number, pageSize: number, path?: string, filter?: {[fieldName: string]: string},
    orderBy?: {[fieldName: string]: boolean}) {
    const loadingIndex = this.startLoading();
    this.service.getRowsPage(offset, pageSize, path, filter, orderBy).pipe(
      catchError(() => of([])),
      finalize(() => this.stopLoading(loadingIndex))
    ).subscribe(result => this.setRecords(result.rows, result.count, loadingIndex));
  }
}
