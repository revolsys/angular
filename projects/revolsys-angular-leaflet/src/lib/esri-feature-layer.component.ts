import {
  Component,
  Input
} from '@angular/core';
import {
  FeatureLayer
} from 'esri-leaflet';
import {LayerComponent} from './layer.component';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-esri-feature-layer',
  template: ''
})
export class EsriFeatureLayerComponent extends LayerComponent {
  @Input() url: string;

  constructor(mapService: MapService
  ) {
    super(mapService);
  }

  newLayer() {
    return new FeatureLayer(this.getOptions());
  }

  protected getOptions(): any {
    const options = super.getOptions();
    options['url'] = this.url;
    options['useCors'] = false;
    return options;
  }
}
