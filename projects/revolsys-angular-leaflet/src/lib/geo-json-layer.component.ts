import {
  Component,
  Input
} from '@angular/core';
import {
  ILayer,
  TileLayer
} from 'leaflet';
import {LayerComponent} from './layer.component';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-geojson-layer',
  template: ''
})
export class GeoJsonLayerComponent extends LayerComponent {
  data: any;

  @Input() stroke = true;

  @Input() color = '#03f';

  @Input() weight = 5;

  @Input() opacity = 0.5;

  @Input() fill = true;

  @Input() fillColor: string;

  @Input() fillOpacity = 0.2;

  @Input() fillRule = 'evenodd';

  @Input() dashArray: string;

  @Input() lineCap: string;

  @Input() lineJoin: string;

  @Input() clickable = true;

  @Input() pointerEvents: string;

  @Input() className = '';

  constructor(mapService: MapService
  ) {
    super(mapService);
  }

  newLayer(): ILayer {
    return new TileLayer(
      this.data,
      this.getOptions()
    );
  }

  protected getOptions(): any {
    return {
      stroke: this.stroke,
      color: this.color,
      weight: this.weight,
      opacity: this.opacity,
      fill: this.fill,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      fillRule: this.fillRule,
      dashArray: this.dashArray,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      clickable: this.clickable,
      pointerEvents: this.pointerEvents,
      className: this.className
    };
  }
}
