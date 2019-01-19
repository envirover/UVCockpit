import esriRequest = require("esri/request");
import GeoJSON = require("geojson");

/**
 * QGroundControl mission plan
 */
export interface UVMissionPlan {
    fileType: string;
    groundStation: string;
    version: number;
    geoFence?: any;
    mission?: {
        plannedHomePosition: number[],
        cruiseSpeed: number,
        hoverSpeed: number,
        items: any[]
    };
    rallyPoints?: any;
}

/**
 * Client class for UV Tracks web service.
 * 
 * See the API docs at http://envirover.com/docs/uvtracks-apidocs.html
 */
export class UVTracksClient {

    /**
     * Constructs an instance of UVTracksClient
     * 
     * @param url UV Tracks service base URL.
     */
    constructor(private url: string) { }

    /**
     * Returns reported positions and state information of the vehicle in GeoJSON format.
     * 
     * @param sysId System ID. 
     * @param startTime Start of time range query as UNIX epoch time.
     * @param endTime End of time range query as UNIX epoch time.
     * @param top Maximum number of returned entries.
     * @returns reported positions and state information of the vehicle in GeoJSON format.
     */
    getTracks(sysId?: number, startTime?: number, endTime?: number, top?: number): IPromise<GeoJSON.FeatureCollection> {
        var tracksUrl = this.url + "/uvtracks/api/v1/tracks";

        const parameters = {
            'SysId': sysId,
            'StartTime': startTime,
            'EndTime': endTime,
            'Top': top
        }

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length != 0) {
            tracksUrl += '?' + queryString;
        }

        const value = esriRequest(tracksUrl, {
            responseType: "json"
        });

        return value.then(response => response.data);
    }

    /**
     * Returns mission plan of the vehicle.
     * 
     * @param sysId System ID
     * @returns mission plan of the vehicle.
     */
    getMissions(sysId?: number): IPromise<UVMissionPlan> {
        var missionsUrl = this.url + "/uvtracks/api/v1/missions";

        const parameters = {
            'SysId': sysId
        }

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length != 0) {
            missionsUrl += '?' + queryString;
        }

        const value = esriRequest(missionsUrl, {
            responseType: "json"
        });

        return value.then(response => response.data);
    }

    private encodeQueryString(data: any): string {
        return Object.keys(data)
            .filter(key => data[key])
            .map(function (key) {
                return [key, data[key]].map(encodeURIComponent).join("=");
            }).join("&");
    }

}