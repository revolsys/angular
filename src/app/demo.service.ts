import {
  Observable, of
} from 'rxjs';
import {
  Injectable,
  Injector
} from '@angular/core';
import {BaseService} from 'revolsys-angular-framework';

@Injectable()
export class DemoService extends BaseService<any> {

  constructor(injector: Injector) {
    super(injector);
    this.path = '/demo';
    this.pathParamName = 'id';
    this.typeTitle = 'DEMO';
    this.labelFieldName = 'label';
  }

  deleteObject(api: any, path?: string): Observable<boolean> {
    return null;
  }
  getObjectsDo(path: string, options: any): Observable<any[]> {
    const recordCount = 33;
    const records = [];
    for (let i = 0; i < recordCount; i++) {
      const id = i + 1;
      records.push({id: id, label: `record ${id}`});
    }
    return of(records);
  }

  getRowsPage(
    offset: number,
    limit: number,
    _path: string,
    _filter?: {[fieldName: string]: string},
    _orderBy?: {[fieldName: string]: boolean}
  ): Observable<any> {
    const recordCount = 33;
    const records = [];
    for (let i = 0; i < limit && offset + i < recordCount; i++) {
      const id = offset + i + 1;
      records.push({id: id, label: `record ${id}`});
    }
    return of({rows: records, count: recordCount});
  }
  updateObject(api: any): Observable<any> {
    return null;
  }

  newObject(): any {
    return {};
  }
}
