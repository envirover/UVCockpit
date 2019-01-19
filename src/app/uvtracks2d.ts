import UVCockpitConfig = require("app/config");
import MapView = require("esri/views/MapView");
import Map = require("esri/Map");
import { UVTracksClient } from "./uvtracks";
import { UVLayers, ViewType } from "./uvlayers";

const uvCockpitConfig = new UVCockpitConfig();
const uvTracksClient = new UVTracksClient(uvCockpitConfig.uvTracksBaseURL);
const uvLayers = new UVLayers(ViewType.MapView);

/**************************************************
 * Create the map and view
 **************************************************/

const map = new Map({
    basemap: "satellite",
});

const view = new MapView({
    container: "viewDiv",
    map: map
});

view.when(function () {
    uvTracksClient.getMissions()
        .then(plan => {
            map.add(uvLayers.createMissionLinesLayer(plan));
            map.add(uvLayers.createMissionPointsLayer(plan));
        })
        .otherwise(errback);;

    uvTracksClient.getTracks()
        .then(tracks => {
            const trackPointsLayer = uvLayers.createTrackPointsLayer(tracks);
            map.add(uvLayers.createTrackLinesLayer(tracks));
            map.add(trackPointsLayer);
            zoomToLayer(trackPointsLayer);
        })
        .otherwise(errback);
});

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
