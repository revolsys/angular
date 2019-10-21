import {
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {Params} from '@angular/router';
import {BaseComponent} from './BaseComponent';
import {Service} from '../Service/Service';
import {Observable} from 'rxjs';

export class BaseDetailComponent<T> extends BaseComponent<T> implements OnInit {
  @Input()
  addPage = false;

  form: FormGroup;

  id: string;

  idParamName = 'id';

  object: T;

  initialized = false;

  protected formBuilder: FormBuilder = this.injector.get(FormBuilder);

  constructor(injector: Injector, service: Service<T>, title: string) {
    super(injector, service, title);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params[this.idParamName];
        if (this.id) {
          this.service.getObject(this.id)//
            .subscribe(object => this.setObject(object));
        } else {
          const object = this.service.newObject();
          this.setObject(object);
        }
      });
  }

  get notFound(): boolean {
    if (this.initialized) {
      return this.object === null;
    } else {
      return false;
    }
  }

  protected setObject(object: T) {
    this.object = object;
    this.initialized = true;
  }

  postSave(savedObject: T): void {
  }

  protected saveDo(): Observable<T> {
    return this.service.addOrUpdateObject(this.object);
  }

  protected saveValues(object: any, form: AbstractControl) {
    for (const key of Object.keys(form.value)) {
      const value = form.value[key];
      object[key] = value;
    }
  }

  save(close: boolean = true): void {
    this.saveDo()
      .subscribe(savedObject => {
        if (savedObject != null) {
          this.postSave(savedObject);
          if (close) {
            this.routeList();
          } else if (this.addPage) {
            this.routeDetail();
          }
        }
      });
  }

  routeDetail(): void {
  }
}
