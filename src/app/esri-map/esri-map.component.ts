import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import { trackPoint, trackLine, missionPoint, missionLine } from '../uvlayers';
import { UVTracksClient } from '../uvtracks';
import { GeoAdapter } from '../geo-adapter';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode') private mapViewEl: ElementRef = new ElementRef(null);

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
      const [Map, MapView, Point, Polyline, geometryEngine, FeatureLayer] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/geometryEngine',
        'esri/layers/FeatureLayer'
      ]);

      const map = new Map({
        basemap: this._basemap,
        spatialReference: {
          wkid: 3857
        }
      });

      const view = new MapView({
        container: this.mapViewEl.nativeElement,
        map: map
      });

      const uvtracks = this.uvtracks;

      const adapter = new GeoAdapter(Point, Polyline, geometryEngine);

      // Do nothing for 2D view.
      const fixHomeAltitude = async function (response: any) {
        return response;
      };

      const fixTracksAltitude = function (response: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection  {
        return response;
      };

      const zoomToLayer = function (layer: any) {
        view.whenLayerView(layer).then(function (layerView: any) {
          layerView.queryExtent().then(function (response: any) {
            // go to the extent of all the graphics in the layer view
            if (response.extent != null) {
              view.scale = 10000;
              view.goTo(response.extent);
            }
          });
        });
      };

      const createTrackPointsLayer = function (graphics: any) {
        const pointsLayer = new FeatureLayer({
          source: graphics, // autocast as an array of esri/Graphic
          fields: trackPoint.fields,
          objectIdField: 'sysid',
          renderer: trackPoint.renderer2d,
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
          source: graphics, // autocast as an array of esri/Graphic
          fields: trackLine.fields,
          objectIdField: 'sysid',
          renderer: trackLine.renderer2d,
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
          source: graphics, // autocast as an array of esri/Graphic
          fields: missionPoint.fields,
          objectIdField: 'seq',
          renderer: missionPoint.renderer2d,
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
          source: graphics, // autocast as an array of esri/Graphic
          fields: missionLine.fields,
          objectIdField: 'sysid',
          renderer: missionLine.renderer2d,
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
          .then(createTrackPointsLayer)
          .then(zoomToLayer)
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
