
import { Injectable } from '@angular/core';
import { uvCockpitConfig } from './config';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from 'geojson';

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

    /**
     * Returns reported positions and state information of the vehicle in GeoJSON format.
     *
     * @param sysId System ID.
     * @param startTime Start of time range query as UNIX epoch time.
     * @param endTime End of time range query as UNIX epoch time.
     * @param top Maximum number of returned entries.
     * @returns reported positions and state information of the vehicle in GeoJSON format.
     */
    async getTracks(sysId?: number, startTime?: number, endTime?: number, top?: number): Promise<FeatureCollection> {
        let tracksUrl = uvCockpitConfig.uvTracksBaseURL + '/uvtracks/api/v1/tracks';

        console.log('getTracks: ' + tracksUrl);

        const parameters = {
            'SysId': sysId,
            'StartTime': startTime,
            'EndTime': endTime,
            'Top': top
        }

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length !== 0) {
            tracksUrl += '?' + queryString;
        }

        return this.http.get<FeatureCollection>(tracksUrl).toPromise();
    }

    /**
     * Returns mission plan of the vehicle.
     * 
     * @param sysId System ID
     * @returns mission plan of the vehicle.
     */
    getMissions(sysId?: number): Promise<UVMissionPlan> {
        let missionsUrl = uvCockpitConfig.uvTracksBaseURL + '/uvtracks/api/v1/missions';

        console.log('getMissions: ' + missionsUrl);

        const parameters = {
            'SysId': sysId
        }

        const queryString = this.encodeQueryString(parameters);

        if (queryString.length !== 0) {
            missionsUrl += '?' + queryString;
        }

        return this.http.get<UVMissionPlan>(missionsUrl).toPromise();
    }

    private encodeQueryString(data: any): string {
        return Object.keys(data)
            .filter(key => data[key])
            .map(function (key) {
                return [key, data[key]].map(encodeURIComponent).join('=');
            }).join('&');
    }

}
