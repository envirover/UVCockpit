import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';

import { trackPoint, trackLine, missionPoint, missionLine } from '../uvlayers';
import { UVTracksClient, UVMissionPlan } from '../uvtracks';
import { GeoAdapter } from '../geo-adapter';

@Component({
  selector: 'app-esri-scene',
  templateUrl: './esri-scene.component.html',
  styleUrls: ['./esri-scene.component.css']
})
export class EsriSceneComponent implements OnInit {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('sceneViewNode') private mapViewEl: ElementRef = new ElementRef(null);

  private _zoom = 15;
  private _center: Array<number> = [];
  private _basemap = 'satellite';
  private _loaded = false;

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

  constructor(private uvtracks: UVTracksClient) { }

  async initializeMap() {
    try {

      // Load the modules for the ArcGIS API for JavaScript
      const [Map, SceneView, Point, Polyline, geometryEngine, FeatureLayer] = await loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/geometryEngine',
        'esri/layers/FeatureLayer'
      ]);

      let elevationDelta = 0.0;

      /**************************************************
       * Create the map and view
       **************************************************/

      const map = new Map({
        basemap: this.basemap,
        ground: 'world-elevation'
      });

      map.ground.navigationConstraint = {
        type: 'none'
      };

      map.ground.opacity = 0.8;
      const zoom = this.zoom;

      const view = new SceneView({
        container: this.mapViewEl.nativeElement,
        map: map
      });

      const uvtracks = this.uvtracks;

      const adapter = new GeoAdapter(Point, Polyline, geometryEngine);

      const fixHomeAltitude = async function (plan: UVMissionPlan) {
        if (plan.mission && plan.mission.plannedHomePosition.length > 2) {
          const home = new Point({
            x: plan.mission.plannedHomePosition[1],
            y: plan.mission.plannedHomePosition[0],
            z: plan.mission.plannedHomePosition[2],
          });

          const elevation = await map.ground.layers.items[0].queryElevation(home);

          elevationDelta = elevation.geometry.z - plan.mission.plannedHomePosition[2];

          plan.mission.plannedHomePosition[2] = elevation.geometry.z;
        }

        return plan;
      };

      const fixTracksAltitude = function (geoJson: GeoJSON.FeatureCollection) {
        if (geoJson.features) {
          for (let i = 0; i < geoJson.features.length; i++) {
            const feature = geoJson.features[i];
            (feature.geometry as GeoJSON.Point).coordinates[2] += elevationDelta;
          }
        }

        return geoJson;
      };

      const zoomToLayer = function (graphics: any) {
        const pt = graphics[0].geometry;

        view.goTo({
          target: pt,
          zoom: zoom
        });

        return graphics;
      };

      const createTrackPointsLayer = function (graphics: __esri.Collection<__esri.Graphic>) {
        const pointsLayer = new FeatureLayer({
          source: graphics,
          fields: trackPoint.fields,
          objectIdField: 'sysid',
          renderer: trackPoint.renderer3d,
          spatialReference: {
            wkid: 4326
          },
          geometryType: 'point',
          popupTemplate: trackPoint.template
        });

        map.add(pointsLayer);

        return pointsLayer;
      };

      const createTrackLinesLayer = function (graphics: any) {
        const linesLayer = new FeatureLayer({
          source: graphics,
          fields: trackLine.fields,
          objectIdField: 'sysid',
          renderer: trackLine.renderer3d,
          spatialReference: {
            wkid: 4326
          },
          geometryType: 'polyline',
          popupTemplate: trackLine.template
        });

        map.add(linesLayer);
        return linesLayer;
      };

      const createMissionPointsLayer = function (graphics: any) {
        const pointsLayer = new FeatureLayer({
          source: graphics,
          fields: missionPoint.fields,
          objectIdField: 'seq',
          renderer: missionPoint.renderer3d,
          spatialReference: {
            wkid: 4326
          },
          geometryType: 'point',
          popupTemplate: missionPoint.template,
          labelingInfo: [missionPoint.labelClass]
        });

        map.add(pointsLayer);
        return pointsLayer;
      };

      const createMissionLinesLayer = function (graphics: any) {
        if (graphics == null || graphics.length === 0) {
          return null;
        }

        const linesLayer = new FeatureLayer({
          source: graphics,
          fields: missionLine.fields,
          objectIdField: 'sysid',
          renderer: missionLine.renderer3d,
          spatialReference: {
            wkid: 4326
          },
          geometryType: 'polyline',
          popupTemplate: missionLine.template
        });

        map.add(linesLayer);
        return linesLayer;
      };

      // Executes if data retrieval was unsuccessful.
      const errback = function (error: any) {
        console.error('Error. ', error);
      };

      view.when(function () {
        const missions = uvtracks.getMissions()
          .then(fixHomeAltitude);

        missions
          .then(m => {
            return adapter.convertMissionLinesGraphics(m);
          })
          .then(createMissionLinesLayer)
          .catch(errback);

        missions
          .then(m => {
            return adapter.convertMissionPointsGraphics(m);
          })
          .then(createMissionPointsLayer)
          .catch(errback);

        const tracks = uvtracks.getTracks()
          .then(fixTracksAltitude);

        tracks
          .then(m => {
            return adapter.convertTrackLinesGraphics(m);
          })
          .then(createTrackLinesLayer)
          .catch(errback);

        tracks
          .then(m => {
            return adapter.convertTrackPointsGraphics(m);
          })
          .then(zoomToLayer)
          .then(createTrackPointsLayer)
          .catch(errback);
      });

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
