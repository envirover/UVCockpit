import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import { trackPoint, trackLine, missionPoint, missionLine } from '../uvlayers';
import { UVTracksClient } from '../uvtracks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef = new ElementRef(null);

  private _zoom = 15;
  private _basemap = 'satellite';
  private _loaded = false;
  private sysid?: number;
  private startTime?: number;
  private endTime?: number;
  private top?: number;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor(private uvtracks: UVTracksClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.sysid = params['sysid'] ? Number(params['sysid']) : undefined;
      this.startTime = params['startTime'] ? Number(params['startTime']) : undefined;
      this.endTime = params['endTime'] ? Number(params['endTime']) : undefined;
      this.top = params['top'] ? Number(params['top']) : undefined;
      this.zoom = params['zoom'] ? Number(params['zoom']) : 15;
    });
  }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, GeoJSONLayer] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/GeoJSONLayer'
      ]);

      const uvtracks = this.uvtracks;

      const stateLayer = new GeoJSONLayer({
        // url: uvtracks.getStateURL(this.sysid),
        url: uvtracks.getTracksURL(this.sysid, this.startTime, this.endTime, 1, 'point'),
        renderer: trackPoint.renderer2d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'point',
        refreshInterval: 0.1,
        popupTemplate: trackPoint.template
      });

      const tracksLayer = new GeoJSONLayer({
        url: uvtracks.getTracksURL(this.sysid, this.startTime, this.endTime, this.top, 'line'),
        renderer: trackLine.renderer2d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'polyline',
        refreshInterval: 0.1,
        popupTemplate: trackLine.template
      });

      const missionsPointLayer = new GeoJSONLayer({
        url: uvtracks.getMissionsURL(this.sysid, 'point'),
        renderer: missionPoint.renderer2d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'point',
        popupTemplate: missionPoint.template,
        labelingInfo: [missionPoint.labelClass]
      });

      const missionsLineLayer = new GeoJSONLayer({
        url: uvtracks.getMissionsURL(this.sysid, 'line'),
        renderer: missionLine.renderer2d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'polyline',
        popupTemplate: missionLine.template
      });

      const map = new Map({
        basemap: this._basemap,
        layers: [stateLayer, tracksLayer, missionsPointLayer, missionsLineLayer],
        spatialReference: {
          wkid: 3857
        }
      });

      const view = new MapView({
        container: this.mapViewEl.nativeElement,
        map: map
      });

      const zoomToLayer = function (layer: any, zoom: number) {
        return layer.queryExtent().then(function (response: any) {
          console.log('Zoom to: ', response.extent);
          view.goTo({
            center: response.extent.center,
            zoom: zoom
          });
        });
      };

      stateLayer.when(() => zoomToLayer(stateLayer, this.zoom));

      setInterval(function () { stateLayer.refresh(); }, 5000);

      return view;
    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }

  // Finalize a few things once the MapView has been loaded
  houseKeeping(mapView: any) {
    mapView.when(() => {
      console.log('mapView ready: ', mapView.ready);
      this._loaded = mapView.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then((mapView) => {
      this.houseKeeping(mapView);
    });
  }

}
