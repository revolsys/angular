import {DataSource} from '@angular/cdk/table';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

export class ArrayDataSource<T> extends DataSource<any> {
  recordSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading = this.loadingSubject.asObservable();

  private loadingIndex = 0;

  private recordCountSubject = new BehaviorSubject<number>(0);

  public recordCount = this.recordCountSubject.asObservable();

  connect(): Observable<T[]> {
    return this.recordSubject.asObservable();
  }

  startLoading(): number {
    this.loadingSubject.next(true);
    return ++this.loadingIndex;
  }

  stopLoading(loadingIndex): boolean {
    if (loadingIndex === this.loadingIndex) {
      this.loadingSubject.next(false);
      return true;
    } else {
      return false;
    }
  }

  removeRecord(record: T) {
    const records = this.recordSubject.value.filter(row => row !== record);
    this.setRecords(records);
  }

  setRecords(records: T[], recordCount?: number, loadingIndex = 0) {
    if (loadingIndex === 0 || loadingIndex === this.loadingIndex) {
      if (!records) {
        records = [];
      }
      if (typeof (recordCount) === 'number') {
        this.recordCountSubject.next(recordCount);
      } else {
        this.recordCountSubject.next(records.length);
      }
      this.recordSubject.next(records);
      this.stopLoading(loadingIndex);
    }
  }

  disconnect() {
    this.recordSubject.complete();
    this.loadingSubject.complete();
    this.recordCountSubject.complete();
  }

  get hasValues(): boolean {
    return this.recordCountSubject.value > 0;
  }
}
