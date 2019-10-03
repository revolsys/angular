import {
  Observable,
  of
} from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import {
  AfterViewInit,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatDialog, MatSort
} from '@angular/material';
import {
  MatPaginator,
  MatTableDataSource
} from '@angular/material';

import { BaseComponent } from './BaseComponent';
import { DeleteDialogComponent } from './DeleteDialogComponent';

import { Service } from '../Service/Service';
import { PagingServiceDataSource } from '../Service/PagingServiceDataSource';

export class BaseListComponent<T> extends BaseComponent<T> implements OnInit, AfterViewInit {

  columnNames: string[];

  columns: any[];

  arrayDataSource = new MatTableDataSource<T>();

  pagingDataSource: PagingServiceDataSource<T>;

  deleteRecordTitle: string;

  dialog: MatDialog = this.injector.get(MatDialog);

  filter: { [fieldName: string]: string } = {};

  filterFieldName: string;

  filterFields: any[];

  filterValue: string;

  pageSize = 10;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  paging = false;

  path: string;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  constructor(injector: Injector, service: Service<T>, title: string) {
    super(injector, service, title);
    this.pagingDataSource = new PagingServiceDataSource<T>(this.service);
  }

  get dataSource(): DataSource<T> {
    if (this.paging) {
      return this.pagingDataSource;
    } else {
      return this.arrayDataSource;
    }
  }
  deleteObject(record: T): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        typeTitle: this.deleteRecordTitle || this.service.getTypeTitle(),
        objectLabel: this.service.getLabel(record),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
        this.deleteObjectDo(record);
      }
    });
  }

  protected deleteObjectDo(record: T): void {
    this.service.deleteObject(record, this.path)
      .subscribe((deleted) => {
        if (deleted) {
          this.onDeleted(record);
        }
      })
      ;
  }

  get loading(): Observable<boolean> {
    return this.pagingDataSource.loading;
  }

  newFilter(): { [fieldName: string]: string } {
    const filter: { [fieldName: string]: string } = {};
    if (this.filter) {
      for (const fieldName of Object.keys(this.filter)) {
        filter[fieldName] = this.filter[fieldName];
      }
    }
    if (this.filterFieldName && !(this.filterValue == null)) {
      filter[this.filterFieldName] = this.filterValue;
    }
    return filter;
  }

  ngOnInit() {
    this.refresh();
    if (!this.paging) {
      this.arrayDataSource.sort = this.sort;
      this.arrayDataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    if (this.paginator && this.paging) {
      this.paginator.page.pipe(
        tap(() => this.page())
      ).subscribe();
    }
  }

  onDeleted(record: T): void {
    if (this.paging) {
      this.refresh();
    } else {
      const records = this.arrayDataSource.data.filter(row => row !== record);
      this.arrayDataSource.data = records;
    }
  }

  page() {
    const filter = this.newFilter();
    this.pagingDataSource.loadPage(this.paginator.pageIndex, this.pageSize, this.path, filter);
  }

  get recordCount(): Observable<number> {
    if (this.paging) {
      return this.pagingDataSource.recordCount;
    } else {
      return of(this.arrayDataSource.data.length);
    }
  }

  refresh() {
    if (this.paging) {
      this.page();
    } else {
      const filter = this.newFilter();
      const loadingIndex = this.pagingDataSource.startLoading();
      this.service.getObjects(this.path, filter).pipe(
        catchError(() => of([])),
        finalize(() => this.pagingDataSource.stopLoading(loadingIndex))
      ).subscribe(records => {
        if (this.pagingDataSource.stopLoading(loadingIndex)) {
          this.arrayDataSource.data = records;
        }
      });
    }
  }
}
