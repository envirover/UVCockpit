
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from 'geojson';
import { AppConfig } from './config';

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
@Injectable({
    providedIn: 'root',
})
export class UVTracksClient {

    /**
     * Constructs an instance of UVTracksClient
     *
     * @param url UV Tracks service base URL.
     */
    constructor(private http: HttpClient) { }

    getStateURL(sysId?: number): string {
        let stateUrl = AppConfig.uvTracksBaseURL + '/uvtracks/api/v2/state';

        const parameters = {
            'sysid': sysId
        };

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length !== 0) {
            stateUrl += '?' + queryString;
        }

        return stateUrl;
    }

    getTracksURL(sysId?: number, startTime?: number, endTime?: number, top?: number, geometryType?: string): string {
        let tracksUrl = AppConfig.uvTracksBaseURL + '/uvtracks/api/v2/tracks';

        console.log('getTracks: ' + tracksUrl);

        const parameters = {
            'sysid': sysId,
            'startTime': startTime,
            'endTime': endTime,
            'top': top,
            'geometryType': geometryType
        };

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length !== 0) {
            tracksUrl += '?' + queryString;
        }

        return tracksUrl;
    }

    /**
     * Returns reported positions and state information of the vehicle in GeoJSON format.
     *
     * @param sysId System ID.
     * @param startTime Start of time range query as UNIX epoch time.
     * @param endTime End of time range query as UNIX epoch time.
     * @param top Maximum number of returned entries.
     * @returns reported positions and state information of the vehicle in GeoJSON format.
     */
    async getTracks(sysId?: number, startTime?: number, endTime?: number, top?: number, geometryType?: string): Promise<FeatureCollection> {
        const tracksUrl = this.getTracksURL(sysId, startTime, endTime, top, geometryType);

        return this.http.get<FeatureCollection>(tracksUrl).toPromise();
    }

    getMissionsURL(sysId?: number, geometryType?: string): string {
        let missionsUrl = AppConfig.uvTracksBaseURL + '/uvtracks/api/v2/missions';

        console.log('getMissions: ' + missionsUrl);

        const parameters = {
            'sysid': sysId,
            'geometryType': geometryType
        };

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length !== 0) {
            missionsUrl += '?' + queryString;
        }

        return missionsUrl;
    }

    /**
     * Returns mission plan of the vehicle.
     *
     * @param sysId System ID
     * @returns mission plan of the vehicle.
     */
    getMissions(sysId?: number, geometryType?: string): Promise<FeatureCollection> {
        const missionsUrl = this.getMissionsURL(sysId, geometryType);

        return this.http.get<FeatureCollection>(missionsUrl).toPromise();
    }

    private encodeQueryString(data: any): string {
        return Object.keys(data)
            .filter(key => data[key])
            .map(function (key) {
                return [key, data[key]].map(encodeURIComponent).join('=');
            }).join('&');
    }

}
