import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {MapService} from './map.service';
import {Map as LMap} from 'leaflet';
import * as L from 'leaflet';
import {ZoomToWorld} from './ZoomToWorld';

@Component({
  selector: 'leaflet-map',
  template: '<div class="map" #map></div>',
  styles: [`
:host {
  flex: 1 1 auto;
  display:flex;
  flex-direction: column;
}

.map {
  flex: 1 1 auto;
}
`]
})
export class MapComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;

  constructor(
    private mapService: MapService
  ) {
  }

  private worldBounds = L.latLngBounds([
    [47.9, -140.1],
    [60.1, -113.9]
  ]);

  ngOnInit() {
    const map = new LMap(this.mapElement.nativeElement, {
      zoomControl: false
    });
    map.addControl(new ZoomToWorld({
      bounds: this.worldBounds
    }));
    this.mapService.setMap(map);
  }
}
