import {
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material';

import {BaseComponent} from './BaseComponent';
import {DeleteDialogComponent} from './DeleteDialogComponent';

import {ArrayDataSource} from '../Service/ArrayDataSource';
import {Service} from '../Service/Service';

export class BaseListComponent<T> extends BaseComponent<T> implements OnInit {
  columns: any[];

  dataSource = new ArrayDataSource<T>();

  deleteRecordTitle: string;

  dialog: MatDialog = this.injector.get(MatDialog);

  refreshingCount = 0;

  rows: Array<T> = [];

  count = 0;

  hasRows = false;

  offset = 0;

  private lastOffset = -1;

  limit = 100;

  filterFields: any[];

  filterFieldName: string;

  filterValue: string;

  filter: {[fieldName: string]: string} = {};

  paging = false;

  path: string;

  cssClasses = {
    sortAscending: 'fa fa-chevron-down',
    sortDescending: 'fa fa-chevron-up',
    pagerLeftArrow: 'fa fa-chevron-left',
    pagerRightArrow: 'fa fa-chevron-right',
    pagerPrevious: 'fa fa-step-backward',
    pagerNext: 'fa fa-step-forward'
  };

  constructor(injector: Injector, service: Service<T>, title: string) {
    super(injector, service, title);
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.paging) {
      this.page(this.offset, this.limit);
    } else {
      this.refreshingCount++;
      const filter = this.newFilter();
      this.service.getObjects(this.path, filter).subscribe(objects => {
        this.setRows(objects);
        this.refreshingCount--;
      });
    }
  }

  protected setRows(rows: T[]) {
    this.rows = rows;
    this.hasRows = rows.length > 0;
    this.dataSource.setData(rows);
  }

  deleteObject(object: T): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        typeTitle: this.deleteRecordTitle || this.service.getTypeTitle(),
        objectLabel: this.service.getLabel(object),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
        this.deleteObjectDo(object);
      }
    });
  }

  protected deleteObjectDo(object: T): void {
    this.service.deleteObject(object, this.path)
      .subscribe((deleted) => {
        if (deleted) {
          this.onDeleted(object);
        }
      })
      ;
  }

  onDeleted(object: T): void {
    if (this.paging) {
      this.refresh();
    } else {
      const rows = this.rows.filter(row => row !== object);
      this.setRows(rows);
    }
  }

  getRows(): Array<T> {
    return this.rows;
  }

  page(offset: number, limit: number) {
    this.refreshingCount++;
    this.fetch(offset, limit, (results: any) => {
      this.refreshingCount--;
      if (results) {
        this.count = results.count;
        this.setRows(results.rows);
      }
    });
  }

  newFilter(): {[fieldName: string]: string} {
    const filter: {[fieldName: string]: string} = {};
    if (this.filter) {
      for (const fieldName of Object.keys(this.filter)) {
        filter[fieldName] = this.filter[fieldName];
      }
    }
    if (this.filterFieldName) {
      filter[this.filterFieldName] = this.filterValue;
    }
    return filter;
  }

  fetch(offset: number, limit: number, callback: (results: any) => void) {
    const filter = this.newFilter();
    this.service.getRowsPage(
      offset,
      limit,
      this.path,
      this.filter
    ).subscribe(callback);
  }

  onPage(event: any) {
    if (this.lastOffset !== event.offset) {
      this.lastOffset = event.offset;
      this.page(event.offset, event.limit);
    }
  }
}
