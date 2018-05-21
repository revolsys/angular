import {
  Observable,
  of,
  throwError
} from 'rxjs';
import {
  map,
  catchError
} from 'rxjs/operators';
import {
  Injectable,
  Injector,
  Optional
} from '@angular/core';

import {
  Location
} from '@angular/common';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  MatDialog,
  MatDialogRef
} from '@angular/material';

import {DOCUMENT} from '@angular/platform-browser';

import {Config} from '../Config';

import {Service} from './Service';

import {LoginDialogComponent} from '../Component/LoginDialogComponent';

import {MessageDialogComponent} from '../Component/MessageDialogComponent';
import {HttpErrorResponse} from "@angular/common/http";
import {HttpParams} from "@angular/common/http";

@Injectable()
export abstract class BaseService<T> implements Service<T> {

  private static loginDialog: MatDialogRef<LoginDialogComponent> = null;

  protected config: Config;

  protected document: any;

  protected http: HttpClient;

  protected location: Location;

  protected path: string;

  protected typeTitle: string;

  protected labelFieldName: string;

  protected idFieldName = 'id';

  pathParamName = 'id';

  dialog: MatDialog;

  usePostForDelete = true;

  public readonly jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    protected injector: Injector
  ) {
    this.config = injector.get(Config);
    this.document = injector.get(DOCUMENT);
    this.http = injector.get(HttpClient);
    this.location = injector.get(Location);
    this.dialog = injector.get(MatDialog);
  }

  addObject(object: T, path?: string): Observable<T> {
    if (!path) {
      path = this.path;
    }
    return this.addObjectDo(
      path,
      object
    );
  }

  public httpRequest<R>(request: (http: HttpClient) => Observable<any>, handler: (response: any) => R): Observable<R> {
    const response = request(this.http);
    return response.pipe(
      map(handler), //
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          let loginDialog = BaseService.loginDialog;
          if (loginDialog) {
            loginDialog.componentInstance.login();
          } else {
            loginDialog = this.dialog.open(LoginDialogComponent, {
              disableClose: true
            });
            BaseService.loginDialog = loginDialog;
            loginDialog.afterClosed().subscribe(dialogResponse => {
              BaseService.loginDialog = null;
            });
          }
          loginDialog.afterClosed().subscribe(dialogResponse => {
            if (dialogResponse === 'Login') {
              return this.httpRequest(request, handler);
            } else {
              return throwError('Not logged in');
            }
          });
        } else if (error.status === 404) {
          return of(null);
        } else {
          this.showError(error.message);
          return throwError(error.message);
        }
      })
    );
  }

  protected addObjectDo(path: string, object: T, callback?: () => void): Observable<T> {
    const url = this.getUrl(path);
    const jsonText = JSON.stringify(object);
    return this.httpRequest(
      http => {
        return http.post(
          url,
          jsonText,
          {headers: this.jsonHeaders}
        );
      },
      json => {
        if (json.error) {
          this.showError(json.error, json.body);
          return null;
        } else {
          Object.assign(object, json);
          if (callback) {
            callback();
          }
          return object;
        }
      }
    );
  }

  addOrUpdateObject(object: T): Observable<T> {
    if (object == null) {
      return of(object);
    } else if (object[this.idFieldName]) {
      return this.updateObject(object);
    } else {
      return this.addObject(object);
    }
  }

  protected showError(message: string, body?: string) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Error',
        message: message,
        body: body,
      }
    });
  }

  public getUrl(path: string): string {
    return this.config.basePath + '/rest' + path;
  }

  deleteObject(object: T, path?: string): Observable<boolean> {
    return null;
  }

  protected deleteObjectDo(path: string, callback?: (deleted: boolean) => void, parameters?: any): Observable<boolean> {
    const params = new HttpParams();
    if (parameters) {
      for (const name of Object.keys(parameters)) {
        params.set(name, parameters[name]);
      }
    }

    const url = this.getUrl(path);
    const handler = httpResponse => {
      const json = httpResponse.json();
      if (json.error) {
        this.showError(json.error, json.body);
        return false;
      } else {
        const deleted = json.deleted === true;
        if (callback) {
          callback(deleted);
        }
        return deleted;
      }
    };

    if (this.usePostForDelete) {
      return this.httpRequest(
        http => {
          return http.post(
            url,
            '',
            {
              headers: {
                'Content-Type': 'application/json',
                'X-HTTP-Method-Override': 'DELETE'
              },
              params: params
            }
          );
        },
        handler
      );
    } else {
      return this.httpRequest(
        http => {
          return http.delete(
            url,
            {
              headers: this.jsonHeaders,
              params: params
            }
          );
        },
        handler
      );
    }
  }

  getLabel(object: T): string {
    let fieldNames: string[];
    if (this.labelFieldName) {
      fieldNames = this.labelFieldName.split('.');
    } else {
      fieldNames = [this.idFieldName];
    }
    let value: any = object;
    for (const fieldName of fieldNames) {
      if (value == null) {
        return null;
      } else {
        value = value[fieldName];
      }
    }
    return value;
  }

  getObject(id: string, values?: any): Observable<T> {
    return this.getObjectDo(this.path + '/' + id, values);
  }

  getObjectDo(path: string, values?: any): Observable<T> {
    const url = this.getUrl(path);
    return this.httpRequest(
      http => {
        return http.get(url);
      },
      json => {
        if (json.error) {
          this.showError(json.error, json.body);
          return null;
        } else {
          const object = this.toObject(json);
          if (values) {
            for (const key of Object.keys(values)) {
              object[key] = values[key];
            }
          }
          return object;
        }
      }
    );
  }

  getObjects(path: string, filter: {[fieldName: string]: string}): Observable<T[]> {
    if (!path) {
      path = this.path;
    }
    return this.getObjectsDo(path, filter);
  }

  getObjectsDo(path: string, filter: {[fieldName: string]: string}): Observable<T[]> {
    const params = new HttpParams();
    this.addFilterParams(params, filter);
    const url = this.getUrl(path);

    return this.httpRequest(
      http => {
        return http.get(
          url,
          {
            params: params
          }
        );
      },
      json => {
        return this.getObjectsFromJson(json);
      }
    );
  }

  public getObjectsFromJson(json): T[] {
    const objects: T[] = [];
    if (json.error) {
      this.showError(json.error, json.body);
    } else {
      const data = json.data;
      if (data) {
        data.forEach((recordJson: any) => {
          const record = this.toObject(recordJson);
          objects.push(record);
        });
      }
    }
    return objects;
  }

  getPath(): string {
    return this.path;
  }

  private addFilterParams(params: HttpParams, filter: {[fieldName: string]: string}) {
    if (filter) {
      for (const fieldName of Object.keys(filter)) {
        const value = filter[fieldName];
        params.append('filterFieldName', fieldName);
        params.append('filterValue', value);
      }
    }
  }
  getRowsPage(
    offset: number,
    limit: number,
    path: string,
    filter: {[fieldName: string]: string}
  ): Observable<any> {
    const params = new HttpParams();
    params.set('offset', offset.toString());
    params.set('limit', limit.toString());
    this.addFilterParams(params, filter);
    if (!path) {
      path = this.path;
    }
    const url = this.getUrl(path);
    return this.httpRequest(
      http => {
        return http.get(
          url,
          {
            params: params
          }
        );
      },
      json => {
        const rows: T[] = [];
        let total = 0;
        if (json.error) {
          this.showError(json.error, json.body);
          return null;
        } else {
          const data = json.data;
          if (data) {
            data.forEach((recordJson: any) => {
              const record = this.toObject(recordJson);
              rows.push(record);
            });
            total = json.total;
          }
        }
        return {
          rows: rows,
          count: total
        };
      }
    );
  }

  getTypeTitle(): string {
    return this.typeTitle;
  }

  newObject(): T {
    return null;
  }

  toObject(json: any): T {
    const record = this.newObject();
    Object.assign(record, json);
    return record;
  }

  updateObject(object: T): Observable<T> {
    return null;
  }

  protected updateObjectDo(path: string, object: T, callback?: () => void): Observable<T> {
    const url = this.getUrl(path);
    const jsonText = JSON.stringify(object);
    return this.httpRequest(
      http => {
        return http.put(
          url,
          jsonText,
          {headers: this.jsonHeaders}
        );
      },
      json => {
        if (json.error) {
          this.showError(json.error, json.body);
          return null;
        } else {
          Object.assign(object, json);
          if (callback) {
            callback();
          }
          return object;
        }
      }
    );
  }
}
