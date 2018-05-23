import {
  Component,
  OnInit,
  Injector
} from '@angular/core';
import {BaseListComponent} from 'revolsys-angular-framework';
import {DemoService} from '../demo.service';
@Component({
  selector: 'app-demo-list-page',
  templateUrl: './demo-list-page.component.html',
  styleUrls: ['./demo-list-page.component.css']
})
export class DemoListPageComponent extends BaseListComponent<any> {

  constructor(
    injector: Injector,
    protected demoService: DemoService
  ) {
    super(injector, demoService, 'Demo List');
    this.columnNames = ['id', 'label'];
    this.paging = true;
  }
}
