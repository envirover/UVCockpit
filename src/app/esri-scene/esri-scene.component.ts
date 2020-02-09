import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';

import { trackPoint, trackLine, missionPoint, missionLine } from '../uvlayers';
import { UVTracksClient } from '../uvtracks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-esri-scene',
  templateUrl: './esri-scene.component.html',
  styleUrls: ['./esri-scene.component.css']
})
export class EsriSceneComponent implements OnInit {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('sceneViewNode', { static: true }) private mapViewEl: ElementRef = new ElementRef(null);

  private _zoom = 15;
  private _center: Array<number> = [];
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
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
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
      const [Map, SceneView, GeoJSONLayer] = await loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/layers/GeoJSONLayer'
      ]);

      // let elevationDelta = 0.0;

      /**************************************************
       * Create the map and view
       **************************************************/

      const uvtracks = this.uvtracks;

      const stateLayer = new GeoJSONLayer({
        // url: uvtracks.getStateURL(this.sysid),
        url: uvtracks.getTracksURL(this.sysid, this.startTime, this.endTime, 1, 'point'),
        renderer: trackPoint.renderer3d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'point',
        popupTemplate: trackPoint.template
      });

      const tracksLayer = new GeoJSONLayer({
        url: uvtracks.getTracksURL(this.sysid, this.startTime, this.endTime, this.top, 'line'),
        renderer: trackLine.renderer3d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'polyline',
        popupTemplate: trackLine.template
      });

      const missionsPointLayer = new GeoJSONLayer({
        url: uvtracks.getMissionsURL(this.sysid, 'point'),
        renderer: missionPoint.renderer3d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'point',
        popupTemplate: missionPoint.template,
        labelingInfo: [missionPoint.labelClass]
      });

      const missionsLineLayer = new GeoJSONLayer({
        url: uvtracks.getMissionsURL(this.sysid, 'line'),
        renderer: missionLine.renderer3d,
        spatialReference: {
          wkid: 4326
        },
        geometryType: 'polyline',
        popupTemplate: missionLine.template
      });

      const map = new Map({
        basemap: this.basemap,
        layers: [stateLayer, tracksLayer, missionsPointLayer, missionsLineLayer],
        ground: 'world-elevation'
      });

      map.ground.navigationConstraint = {
        type: 'none'
      };

      map.ground.opacity = 0.8;
      // const zoom = this.zoom;

      const view = new SceneView({
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
