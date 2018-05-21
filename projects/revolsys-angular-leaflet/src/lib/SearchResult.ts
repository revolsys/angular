import {LatLng, LatLngBounds} from 'leaflet';
export class SearchResult {
  constructor(
    public id: any,
    public label: string,
    public point?: LatLng,
    public bounds?: LatLngBounds) {
  }
}
