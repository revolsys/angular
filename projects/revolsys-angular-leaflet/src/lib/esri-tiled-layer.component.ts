import {
  Component,
  Input
} from '@angular/core';
import {
  TiledMapLayer
} from 'esri-leaflet';
import {TileLayerComponent} from './tile-layer-component';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-esri-tiled-layer',
  template: ''
})
export class EsriTiledLayerComponent extends TileLayerComponent {

  constructor(mapService: MapService
  ) {
    super(mapService);
  }

  newLayer() {
    return new TiledMapLayer(this.getOptions());
  }


  protected getOptions(): any {
    const options = super.getOptions();
    options['url'] = this.url;
    options['useCors'] = false;
    return options;
  }
}

