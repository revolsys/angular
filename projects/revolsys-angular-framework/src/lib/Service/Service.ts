import {Observable} from 'rxjs';

import {HttpClient} from '@angular/common/http';

export interface Service<T> {

  addObject(object: T, path?: string): Observable<T>;

  addOrUpdateObject(object: T): Observable<T>;

  deleteObject(object: T, path?: string): Observable<boolean>;

  newObject(): T;

  toObject(json: any): T;

  updateObject(object: T): Observable<T>;

  getLabel(object: T): string;

  getObjects(path?: string, options?: any): Observable<T[]>;

  getObjectsFromJson(json): T[];

  getObject(id: string, values?: any): Observable<T>;

  getPath(): string;

  getRowsPage(
    offset: number,
    limit: number,
    path?: string,
    filter?: {[fieldName: string]: string},
    orderBy?: {[fieldName: string]: boolean}
  ): Observable<any>;

  getTypeTitle(): string;

  getUrl(path: string): string;

  httpRequest<R>(request: (http: HttpClient) => Observable<any>, handler: (response: any) => T): Observable<T>;
}
