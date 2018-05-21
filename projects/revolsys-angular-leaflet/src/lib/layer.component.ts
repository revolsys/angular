import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {ILayer} from 'leaflet';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-layer',
  template: ''
})
export class LayerComponent implements OnInit {

  @Input() layerId: string;

  @Input() name: string;

  @Input() basemapLayer: boolean;

  @Input() minZoom: number;

  @Input() maxZoom: number;

  protected layer: ILayer;

  constructor(protected mapService: MapService
  ) {
  }


  newLayer(): ILayer {
    return null;
  }

  protected getOptions(): any {
    const options = {};
    if (this.minZoom) {
      options['minZoom'] = this.minZoom;
    }
    if (this.maxZoom) {
      options['maxZoom'] = this.maxZoom;
    }
    return options;
  }

  ngOnInit() {
    this.layer = this.newLayer();
    if (this.basemapLayer === true) {
      this.mapService.addBaseLayer(this.layer, this.name, this.layerId);
    } else {
      this.mapService.addOverlayLayer(this.layer, this.name, this.layerId);
    }
  }
}
