import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  control,
  ImageOverlay,
  ILayer,
  GeoJSON,
  DivIcon,
  Map as LMap,
  Marker,
  Util
} from 'leaflet';

@Injectable()
export class MapService {

  private baseLayers: {[name: string]: ILayer} = {};

  private layersById: {[id: string]: ILayer} = {};

  private map: LMap;

  private mapCallbacks: ((map) => void)[] = [];

  private overlayLayers: any = {};

  layerControl = control.layers();

  scale: any;

  constructor(
    private http: HttpClient
  ) {
  }

  getMap(): LMap {
    return this.map;
  }

  getLayer(id: string): ILayer {
    return this.layersById[id];
  }

  public loadJson(layer: GeoJSON, file: string) {
    this.http.get(file).subscribe(data => {
      layer.clearLayers();
      layer.addData(data);
    });
  }

  withMap(action: (map) => void) {
    if (this.map) {
      action(this.map);
    } else {
      this.mapCallbacks.push(action);
    }
  }


  removeLayer(layer: ILayer) {
    if (layer) {
      for (const id in Object.keys(this.layersById)) {
        const otherLayer = this.layersById[id];
        if (otherLayer == layer) {
          delete this.layersById[id];
        }
      }
      for (const name in Object.keys(this.overlayLayers)) {
        const otherLayer = this.overlayLayers[name];
        if (otherLayer == layer) {
          delete this.overlayLayers[name];
        }
      }
      this.layerControl.removeLayer(layer);

      this.withMap(map => {
        layer.addTo(this.map);
        if (name) {
          this.layerControl.addOverlay(layer, name);
        }
      });
    }
  }

  resetStyles(layer: GeoJSON) {
    layer.eachLayer(featureLayer => layer.resetStyle(featureLayer));
  }

  setMap(map: LMap) {
    if (this.map !== map) {
      this.map = map;
      if (map !== null) {
        for (const callback of this.mapCallbacks) {
          callback(map);
        }
        this.mapCallbacks.length = 0;
        this.layerControl.addTo(map);
        this.scale = control.scale();
        this.scale.addTo(map);
      }
    }
  }

  addBaseLayer(layer: ILayer, name: string, id?: string) {
    if (layer) {
      if (id) {
        this.layersById[id] = layer;
      }
      this.baseLayers[name] = layer;
      if (Object.keys(this.baseLayers).length === 1) {
        layer.addTo(this.map);
      }
      this.layerControl.addBaseLayer(layer, name);
    }
  }

  addOverlayLayer(layer: ILayer, name?: string, id?: string) {
    if (layer) {
      if (id) {
        this.layersById[id] = layer;
      }

      if (name) {
        this.overlayLayers[name] = layer;
      }
      this.withMap(map => {
        layer.addTo(this.map);
        if (name) {
          this.layerControl.addOverlay(layer, name);
        }
      });
    }
  }

  addLabels(labelsLayer, layer, idFieldName, labelFieldName) {
    const labels = {};

    layer.on('createfeature', (e) => {
      const id = e.feature.properties[idFieldName];
      const feature = layer.getFeature(id);
      const center = feature.getBounds().getCenter();
      const text = e.feature.properties[labelFieldName];
      const label = new Marker(center, {
        icon: new DivIcon({
          iconSize: null,
          className: 'labelGrid',
          html: '<div style="margin-top: -0.5em;margin-left:-' + (text.length / 4) + 'em">' + text + '</div>'
        }),
        keyboard: false,
        interactive: false,
        zIndexOffset: 1000
      });
      labelsLayer.addLayer(label);
      labels[id] = label;
    });

    layer.on('addfeature', (e) => {
      const label = labels[e.feature.properties[idFieldName]];
      if (label) {
        labelsLayer.addLayer(label);
      }
    });

    layer.on('removefeature', (e) => {
      const label = labels[e.feature.properties[idFieldName]];
      if (label) {
        labelsLayer.removeLayer(label);
      }
    });
  }

  addLabel(labelsLayer, text, point, options?): Marker {
    if (text) {
      const label = new Marker(point, {
        icon: new DivIcon(Object.assign({
          iconSize: null,
          html: text
        }, options)),
        keyboard: false,
        interactive: false,
        zIndexOffset: 1000 * labelsLayer.options.zIndex
      });
      labelsLayer.addLayer(label);
      return label;
    } else {
      return null;
    }
  }

  wfsGetFeatures(serviceUrl: string, typeName: string, parameters: {[key: string]: any} = {}) {
    let bbox;
    if (parameters['bbox'] === 'map') {
      const bounds = this.map.getBounds();
      bbox = bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth();
    }

    const params = {
      'SERVICE': 'WFS',
      'VERSION': '1.1.0',
      'REQUEST': 'GetFeature',
      'OUTPUTFORMAT': 'json',
      'SRSNAME': 'EPSG:4326',
      'maxFeatures': 1000,
      'TYPENAME': typeName
    };

    for (const key of Object.keys(parameters)) {
      const value = parameters[key];
      if (key === 'bbox') {
        if (value === 'map') {
          if (!parameters['cql_filter']) {
            params['BBOX'] = bbox + ',EPSG:4326';
          }
        }
      } else if (key === 'cql_filter') {
        let geometryFieldName = parameters['geometryFieldName'];
        if (!geometryFieldName) {
          geometryFieldName = 'GEOMETRY';
        }
        if (parameters['bbox'] === 'map') {
          params[key] = 'bbox(' + geometryFieldName + ', ' + bbox + ',\'EPSG:4326\') and ' + value;
        } else {
          params[key] = value;
        }
      } else {
        params[key] = value;
      }
    }
    const url = serviceUrl + Util.getParamString(params);
    return this.http.get(url);
  }

  getWfsFeatures(serviceUrl: string, typeName: string, parameters: {[key: string]: any}, callback) {
    this.wfsGetFeatures(serviceUrl, typeName, parameters).subscribe(data => {
      callback(data);
    });
  }
}
