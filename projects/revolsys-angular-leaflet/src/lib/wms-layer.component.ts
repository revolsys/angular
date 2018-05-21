import {
  Component,
  Input
} from '@angular/core';
import * as L from 'leaflet';
import {TileLayerComponent} from './tile-layer-component';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-wms-layer',
  template: ''
})
export class WmsLayerComponent extends TileLayerComponent {

  @Input() layers = '';

  @Input() styles = '';

  @Input() format = 'image/jpeg';

  @Input() transparent = false;

  @Input() version = '1.1.1';

  constructor(mapService: MapService
  ) {
    super(mapService);
  }

  newLayer() {
    return L.tileLayer.wms(this.url, this.getOptions());
  }

  protected getOptions(): any {
    const options = super.getOptions();
    options['layers'] = this.layers;
    options['styles'] = this.styles;
    options['format'] = this.format;
    options['transparent'] = this.transparent;
    options['version'] = this.version;
    return options;
  }
}
