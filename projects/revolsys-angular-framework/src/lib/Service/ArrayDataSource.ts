import {DataSource} from '@angular/cdk/table';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

export class ArrayDataSource<T> extends DataSource<any> {
  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  connect(): Observable<T[]> {
    return this.dataChange;
  }

  setData(data: T[]) {
    if (!data) {
      data = [];
    }
    this.dataChange.next(data);
  }

  disconnect() {
  }

  get hasValues(): boolean {
    return this.dataChange.value.length > 0;
  }
}
