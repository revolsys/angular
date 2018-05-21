import {
  Component,
  AfterViewInit
} from '@angular/core';
import {MapService} from 'revolsys-angular-leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-demo-map',
  templateUrl: './demo-map.component.html',
  styleUrls: ['./demo-map.component.css']
})
export class DemoMapComponent implements AfterViewInit {

  constructor(
    private mapService: MapService
  ) {
  }


  ngAfterViewInit() {
    L.Icon.Default.imagePath = '/';
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });
    this.mapService.withMap(map => {
      const location = [52.513437, -121.596309];
      map.setView(location, 10);
    });
  }
}
