import { UVMissionPlan } from './uvtracks';

/**
 * GeoAdapter converts GeoJSON and UVMissionPlan features returned by UV Tracks service
 * to Esri graphic format.
 *
 * See https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html.
 */
export class GeoAdapter {

    constructor(private Point: any, private Polyline: any, private geometryEngine: any) {
    }

    convertTrackPointsGraphics(geoJson: GeoJSON.FeatureCollection): any {
        if (geoJson.features.length === 0) {
            return [];
        }

        const feature = geoJson.features[0];

        const coordinates = (feature.geometry as GeoJSON.Point).coordinates;

        const graphics = {
            geometry: new this.Point({
                x: coordinates[0],
                y: coordinates[1],
                z: coordinates[2]
            }),
            attributes: feature.properties
        };

        if (graphics.attributes) {
            graphics.attributes.latitude /= 10000000.0;
            graphics.attributes.longitude /= 10000000.0;
            graphics.attributes.heading /= 100.0;
            graphics.attributes.pitch /= 100.0;
            graphics.attributes.roll /= 100.0;
            graphics.attributes.tilt = graphics.attributes.roll - 90;
        }

        return [graphics];
    }

    convertTrackLinesGraphics(geoJson: GeoJSON.FeatureCollection) {
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

        return [{
            geometry: new this.Polyline({
                hasZ: true,
                hasM: false,
                paths: [coordinates]
            }),
            attributes: {
                from_time: minTime,
                to_time: maxTime
            }
        }];
    }

    convertMissionPointsGraphics(plan: UVMissionPlan) {
        if (plan.mission && plan.mission.plannedHomePosition.length < 3) {
            return [];
        }

        // Create an array of Graphics from mission items
        const points = [];

        if (plan.mission) {
            points.push({
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
            });

            for (let i = 0; i < plan.mission.items.length; i++) {
                const item = plan.mission.items[i];

                if (item.params[5] !== 0 && item.params[6] !== 0) {
                    let point: any = new this.Point({
                        x: item.params[5],
                        y: item.params[4],
                        z: item.params[6] + points[0].geometry.z
                    });

                    if (item.command === 22) { // takeoff
                        point = new this.Point({
                            x: points[0].geometry.x,
                            y: points[0].geometry.y,
                            z: points[0].geometry.z + item.params[6]
                        });
                    }

                    points.push({
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
                    });
                }
            }
        }

        return points;
    }

    convertMissionLinesGraphics(plan: UVMissionPlan) {
        if (plan.mission && plan.mission.plannedHomePosition.length < 3) {
            return [];
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

        return [{
            geometry: polyline,
            attributes: {
                cruiseSpeed: plan.mission ? plan.mission.cruiseSpeed : 0,
                hoverSpeed: plan.mission ? plan.mission.hoverSpeed : 0,
                length: length
            }
        }];
    }

}
