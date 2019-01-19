import UVCockpitConfig = require("app/config");
import promiseUtils = require("esri/core/promiseUtils");
import SceneView = require("esri/views/SceneView");
import Map = require("esri/Map");
import Point = require("esri/geometry/Point");
import { UVTracksClient, UVMissionPlan } from './uvtracks';
import { UVLayers, ViewType } from "./uvlayers";

const uvCockpitConfig = new UVCockpitConfig();
const uvTracksClient = new UVTracksClient(uvCockpitConfig.uvTracksBaseURL);
const uvLayers = new UVLayers(ViewType.SceneView);

var elevationDelta = 0.0;

/**************************************************
 * Create the map and view
 **************************************************/

const map = new Map({
    basemap: "satellite",
    ground: "world-elevation"
});

map.ground.navigationConstraint = {
    type: "none"
};

map.ground.opacity = 0.8;

const view = new SceneView({
    container: "viewDiv",
    map: map
});

view.when(function () {
    uvTracksClient.getMissions()
        .then(fixHomeAltitude)
        .then(plan => {
            map.add(uvLayers.createMissionLinesLayer(plan));
            map.add(uvLayers.createMissionPointsLayer(plan));
        })
        .otherwise(errback);;

    uvTracksClient.getTracks()
        .then(fixTracksAltitude)
        .then(tracks => {
            const trackPointsLayer = uvLayers.createTrackPointsLayer(tracks);
            map.add(uvLayers.createTrackLinesLayer(tracks));
            map.add(trackPointsLayer);
            zoomToLayer(trackPointsLayer);
        })
        .otherwise(errback);
});

function fixHomeAltitude(plan: UVMissionPlan): IPromise<UVMissionPlan> {
    if (plan.mission && plan.mission.plannedHomePosition.length > 2) {
        const home = new Point({
            x: plan.mission.plannedHomePosition[1],
            y: plan.mission.plannedHomePosition[0],
            z: plan.mission.plannedHomePosition[2],
        });

        const elevation = map.ground.layers.getItemAt(0).queryElevation(home);

        return elevation.then(elevation => {
            elevationDelta = (elevation.geometry as Point).z - home.z;

            if (plan.mission) {
                plan.mission.plannedHomePosition[2] = (elevation.geometry as Point).z;
            }

            return plan;
        }).catch(error => {
            console.error(error);
            return plan;
        });
    }

    return promiseUtils.resolve(plan);
}

function fixTracksAltitude(geoJson: GeoJSON.FeatureCollection) {
    for (let i = 0; i < geoJson.features.length; i++) {
        const feature = geoJson.features[i];
        (feature.geometry as GeoJSON.Point).coordinates[2] += elevationDelta;
    }

    return geoJson;
}

function zoomToLayer(layer: any) {
    view.whenLayerView(layer).then(function (layerView: any) {
        layerView.queryExtent().then(function (response: any) {
            // go to the extent of all the graphics in the layer view
            if (response.extent != null) {
                view.scale = 10000;
                view.goTo(response.extent);
            }
        });
    });
}

// Executes if data retrieval was unsuccessful.
function errback(error: any) {
    console.error("Error. ", error);
}
