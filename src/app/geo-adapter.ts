import { UVMissionPlan } from './uvtracks';

/**
 * GeoAdapter converts GeoJSON and UVMissionPlan features returned by UV Tracks service
 * to Esri graphic format.
 *
 * See https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html.
 */
export class GeoAdapter {

    /**
     * Construct GeoAdapter instance
     *
     * @param Point 'esri/geometry/Point' module
     * @param Polyline 'esri/geometry/Polyline' module
     * @param Collection 'esri/core/Collection' module
     * @param Graphic 'esri/Graphic' module
     * @param geometryEngine 'esri/geometry/geometryEngine' module
     */
    constructor(private Point: any, private Polyline: any, private Collection: any,
                private Graphic: any, private geometryEngine: any) {
    }

    /**
     * Converts a collection of HIGH_LATENCY messages from GeoJSON FeatureCollection
     * to collection of Esri Graphic objects of point geometry type.
     *
     * @param geoJson HIGH_LATENCY messages in GeoJSON FeatureCollection format
     */
    public convertTrackPointsGraphics(geoJson: GeoJSON.FeatureCollection): __esri.Collection<__esri.Graphic> {
        const points = new this.Collection();

        if (geoJson.features.length === 0) {
            return points;
        }

        const feature = geoJson.features[0];

        const coordinates = (feature.geometry as GeoJSON.Point).coordinates;

        const graphic = new this.Graphic({
            geometry: new this.Point({
                x: coordinates[0],
                y: coordinates[1],
                z: coordinates[2]
            }),
            attributes: feature.properties
        });

        points.push(graphic);

        return points;
    }

    /**
     * Converts a collection of HIGH_LATENCY messages from GeoJSON FeatureCollection
     * to a collection with single Esri Graphic object with polyline geometry type.
     *
     * @param geoJson HIGH_LATENCY messages in GeoJSON FeatureCollection format
     */
    public convertTrackLinesGraphics(geoJson: GeoJSON.FeatureCollection): __esri.Collection<__esri.Graphic> {
        let minTime = -1;
        let maxTime = -1;
        const coordinates = [];

        for (const feature of geoJson.features) {
            coordinates.push((feature.geometry as GeoJSON.Point).coordinates);

            if (feature.properties) {
                const recordTime = feature.properties.time;

                if (minTime < 0 || recordTime < minTime) {
                    minTime = recordTime;
                }

                if (maxTime < 0 || recordTime > maxTime) {
                    maxTime = recordTime;
                }
            }
        }
        const lines = new this.Collection();

        lines.push(new this.Graphic({
            geometry: new this.Polyline({
                hasZ: true,
                hasM: false,
                paths: [coordinates]
            }),
            attributes: {
                from_time: minTime,
                to_time: maxTime
            }
        }));

        return lines;
    }

    /**
     * Converts mission items of UV mission plan to collection of Esri Graphic objects
     * of point geometry type.
     *
     * @param plan UV mission plan
     */
    public convertMissionPointsGraphics(plan: UVMissionPlan): __esri.Collection<__esri.Graphic> {
        const points = new this.Collection();

        if (plan.mission && plan.mission.plannedHomePosition.length < 3) {
            return points;
        }

        if (plan.mission) {
            points.push(new this.Graphic({
                geometry: new this.Point({
                    x: plan.mission.plannedHomePosition[1],
                    y: plan.mission.plannedHomePosition[0],
                    z: plan.mission.plannedHomePosition[2],
                }),
                attributes: {
                    seq: 0,
                    command: 16,
                    autoContinue: 1,
                    frame: 0,
                    doJumpId: 1,
                    type: 'PlannedHome',
                    params: '[]'
                }
            }));

            for (let i = 0; i < plan.mission.items.length; i++) {
                const item = plan.mission.items[i];

                if (item.params[5] !== 0 && item.params[6] !== 0) {
                    let point: any = new this.Point({
                        x: item.params[5],
                        y: item.params[4],
                        z: item.params[6] + points.getItemAt(0).geometry.z
                    });

                    if (item.command === 22) { // takeoff
                        point = new this.Point({
                            x: points.getItemAt(0).geometry.x,
                            y: points.getItemAt(0).geometry.y,
                            z: points.getItemAt(0).geometry.z + item.params[6]
                        });
                    }

                    points.push(new this.Graphic({
                        geometry: point,
                        attributes: {
                            seq: i + 1,
                            command: item.command,
                            autoContinue: item.autoContinue === true ? 1 : 0,
                            frame: item.frame,
                            doJumpId: item.doJumpId,
                            type: item.type,
                            params: String(item.params)
                        }
                    }));
                }
            }
        }

        return points;
    }

    /**
     * Converts mission items of UV mission plan to a collection with single 
     * Esri Graphic object with polyline geometry type.
     *
     * @param plan UV mission plan
     */
    public convertMissionLinesGraphics(plan: UVMissionPlan): __esri.Collection<__esri.Graphic> {
        const lines = new this.Collection();

        if (plan.mission && plan.mission.plannedHomePosition.length < 3) {
            return lines;
        }

        const coordinates = [];

        if (plan.mission) {
            coordinates.push([plan.mission.plannedHomePosition[1],
            plan.mission.plannedHomePosition[0],
            plan.mission.plannedHomePosition[2]
            ]);

            for (const item of plan.mission.items) {
                const z = item.params[6] + plan.mission.plannedHomePosition[2];
                if (item.params[5] !== 0 && item.params[6] !== 0) {
                    if (item.command === 22) { // takeoff
                        coordinates.push([plan.mission.plannedHomePosition[1], plan.mission.plannedHomePosition[0], z]);
                    } else {
                        coordinates.push([item.params[5], item.params[4], z]);
                    }
                }
            }
        }

        const polyline = new this.Polyline({
            hasZ: true,
            hasM: false,
            paths: coordinates
        });

        const length = this.geometryEngine.geodesicLength(polyline, 'meters');

        lines.push(new this.Graphic({
            geometry: polyline,
            attributes: {
                cruiseSpeed: plan.mission ? plan.mission.cruiseSpeed : 0,
                hoverSpeed: plan.mission ? plan.mission.hoverSpeed : 0,
                length: length
            }
        }));

        return lines;
    }

}
