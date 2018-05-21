import * as L from 'leaflet';

export let WfsLayer = L.GeoJSON.extend({
  options: {
    url: '',
    typeName: '',
    maxFeatures: 1000,
    version: '1.1.1',
    cql_filter: '',
    geometryFieldName: 'SHAPE',
    minZoom: 0,
    maxZoom: Infinity
  },

  initialize: function(options) {
    L.GeoJSON.prototype.initialize.call(this, null, options);
    this.refreshIndex = -1;
    this.searching = false;
  },


  onAdd: function() {
    this._update();
  },

  onRemove: function(map) {
    this.clearLayers();
  },

  getEvents: function() {
    const events = {
      moveend: this._update
    };
    return events;
  },

  isVisible: function() {
    const map = this._map;
    if (map && map.hasLayer(this)) {
      const zoom = map.getZoom();
      if (zoom >= this.options.minZoom && zoom <= this.options.maxZoom) {
        return true;
      }
      return true;
    }
    return false;
  },

  _update: function() {
    const refreshIndex = ++this.refreshIndex;
    this.searching = true;
    const map = this._map;
    if (map) {
      this.fire('preRefresh', {map: map, refreshIndex: refreshIndex});
      if (this.isVisible()) {
        const bounds = map.getBounds();
        const bbox = bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth();

        const params = {
          service: 'WFS',
          version: this.options.version,
          request: 'GetFeature',
          outputFormat: 'json',
          srsName: 'EPSG:4326'
        };
        if (this.options.cql_filter) {
          params['cql_filter'] = 'bbox(' + this.options.geometryFieldName + ', ' + bbox + ',\'EPSG:4326\') and ' + this.options.cql_filter;
        } else {
          params['BBOX'] = bbox + ',EPSG:4326';
        }

        if (this.options.version.indexOf('1') === 0) {
          Object.assign(params, {
            maxFeatures: this.options.maxFeatures,
            typeName: this.options.typeName
          });
        } else {
          params['count'] = this.options.maxFeatures;
          params['typeNames'] = this.options.typeName;
        }
        const layer = this;
        const url = this.options.url + L.Util.getParamString(params);
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status < 400) {
              if (refreshIndex === layer.refreshIndex) {
                layer.searching = false;
                if (layer.isVisible()) {
                  const json = JSON.parse(request.responseText);
                  layer.fire('preUpdate', {map: map});
                  layer.clearLayers();
                  if (json && json.features) {
                    layer.addData(json);
                  }
                  layer.fire('postUpdate', {map: map, features: json.features});
                }
                layer.fire('postRefresh', {map: map, refreshIndex: refreshIndex});
              }
            }
          }
        };
        request.send();
      } else {
        this.fire('preUpdate', {map: map});
        this.clearLayers();
        this.fire('postUpdate', {map: map, features: []});
        this.fire('postRefresh', {map: map, refreshIndex: refreshIndex});
      }
    }
  }
});

WfsLayer.include(L.Events);
