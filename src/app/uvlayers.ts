import FeatureLayer = require("esri/layers/FeatureLayer");
import Collection = require("esri/core/Collection");
import { Point, Polyline } from "esri/geometry";
import Graphic = require("esri/Graphic");
import geometryEngine = require("esri/geometry/geometryEngine");
import { UVMissionPlan } from "./uvtracks";

export enum ViewType {
    MapView,
    SceneView
}

export class UVLayers {

    private readonly trackPoint = {
        fields: [{
            name: "sysid",
            alias: "sysid",
            type: "integer"
        },
        {
            name: "time",
            alias: "time",
            type: "long"
        },
        {
            name: "airspeed",
            alias: "airspeed",
            type: "integer"
        },
        {
            name: "airspeed_sp",
            alias: "airspeed_sp",
            type: "integer"
        },
        {
            name: "altitude_amsl",
            alias: "altitude_amsl",
            type: "integer"
        },
        {
            name: "altitude_sp",
            alias: "altitude_sp",
            type: "integer"
        },
        {
            name: "base_mode",
            alias: "base_mode",
            type: "integer"
        },
        {
            name: "battery_remaining",
            alias: "battery_remaining",
            type: "integer"
        },
        {
            name: "climb_rate",
            alias: "climb_rate",
            type: "integer"
        },
        {
            name: "custom_mode",
            alias: "custom_mode",
            type: "integer"
        },
        {
            name: "failsafe",
            alias: "failsafe",
            type: "integer"
        },
        {
            name: "gps_fix_type",
            alias: "gps_fix_type",
            type: "integer"
        },
        {
            name: "gps_nsat",
            alias: "gps_nsat",
            type: "integer"
        },
        {
            name: "groundspeed",
            alias: "groundspeed",
            type: "integer"
        },
        {
            name: "heading",
            alias: "heading",
            type: "double"
        },
        {
            name: "heading_sp",
            alias: "heading_sp",
            type: "integer"
        },
        {
            name: "landed_state",
            alias: "landed_state",
            type: "integer"
        },
        {
            name: "latitude",
            alias: "latitude",
            type: "double"
        },
        {
            name: "longitude",
            alias: "longitude",
            type: "double"
        },
        {
            name: "pitch",
            alias: "pitch",
            type: "double"
        },
        {
            name: "roll",
            alias: "roll",
            type: "double"
        },
        {
            name: "temperature",
            alias: "temperature",
            type: "integer"
        },
        {
            name: "temperature_air",
            alias: "temperature_air",
            type: "integer"
        },
        {
            name: "throttle",
            alias: "throttle",
            type: "integer"
        },
        {
            name: "wp_distance",
            alias: "wp_distance",
            type: "integer"
        },
        {
            name: "wp_num",
            alias: "wp_num",
            type: "integer"
        }
        ],
        // Set up popup template for the layer
        template: {
            title: "System {sysid} at {time}",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "airspeed",
                    label: "Air speed (m/s)",
                    visible: true
                },
                {
                    fieldName: "airspeed_sp",
                    label: "Air speed setpoint (m/s)",
                    visible: true
                },
                {
                    fieldName: "groundspeed",
                    label: "Ground speed (m/s)",
                    visible: true
                },
                {
                    fieldName: "heading",
                    label: "Heading (decimal degrees)",
                    visible: true
                },
                {
                    fieldName: "heading_sp",
                    label: "Heading setpoint (decimal degrees)",
                    visible: true
                },
                {
                    fieldName: "pitch",
                    label: "Pitch (decimal degrees)",
                    visible: true
                },
                {
                    fieldName: "roll",
                    label: "Roll (decimal degrees)",
                    visible: true
                }, {
                    fieldName: "altitude_amsl",
                    label: "Altitude above mean sea level (m)",
                    visible: true
                },
                {
                    fieldName: "altitude_sp",
                    label: "Altitude setpoint relative home (m)",
                    visible: true
                },
                {
                    fieldName: "climb_rate",
                    label: "Climb rate (m/s)",
                    visible: true
                },
                {
                    fieldName: "latitude",
                    label: "Latitude (decimal degrees)",
                    visible: true
                },
                {
                    fieldName: "longitude",
                    label: "Longitude (decimal degrees)",
                    visible: true
                },
                {
                    fieldName: "gps_fix_type",
                    label: "GPS Fix type",
                    visible: true
                },
                {
                    fieldName: "gps_nsat",
                    label: "Number of GPS satellites visible",
                    visible: true
                },
                {
                    fieldName: "battery_remaining",
                    label: "Remaining battery (%)",
                    visible: true
                },
                {
                    fieldName: "temperature",
                    label: "Battery voltage (volts)",
                    visible: true
                },
                {
                    fieldName: "temperature_air",
                    label: "Battery current (amp)",
                    visible: true
                },
                {
                    fieldName: "throttle",
                    label: "Throttle (%)",
                    visible: true
                },
                {
                    fieldName: "wp_distance",
                    label: "Distance to target (m)",
                    visible: true
                },
                {
                    fieldName: "wp_num",
                    label: "Current waypoint number",
                    visible: true
                },
                {
                    fieldName: "base_mode",
                    label: "Bitmap of enabled system modes",
                    visible: true
                },
                {
                    fieldName: "custom_mode",
                    label: "Bitfield of autopilot-specific flags",
                    visible: true
                },
                {
                    fieldName: "failsafe",
                    label: "Failsafe flags",
                    visible: true
                },
                {
                    fieldName: "landed_state",
                    label: "Landed state",
                    visible: true
                }
                ]
            }]
        },
        renderer2d: {
            authoringInfo: {},
            type: "simple",
            symbol: {
                type: "simple-marker",
                path: "M-29,14.5 0,23.5 -8,14.5 0,5.5z",
                color: "magenta",
                outline: {
                    color: "magenta",
                    width: 0.5
                },
                angle: 0,
                size: 40,
                xoffset: 14.5,
                yoffset: 9
            },
            visualVariables: [{
                "type": "rotation",
                "valueExpression": "-$feature.heading",
                "axis": "heading"
            }]
        },
        renderer3d: {
            type: "simple",
            authoringInfo: {},
            symbol: {
                type: "point-3d", // autocasts as new PointSymbol3D()
                symbolLayers: [{
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 3, // diameter of the object from east to west in meters
                    height: 4, // height of the object in meters
                    depth: 1, // diameter of the object from north to south in meters
                    resource: {
                        primitive: "cone"
                    },
                    material: {
                        color: "magenta"
                    }
                }]
            },
            visualVariables: [{
                "type": "rotation",
                "field": "heading",
                "axis": "heading"
            }, {
                "type": "rotation",
                "field": "roll",
                "axis": "roll"
            }, {
                "type": "rotation",
                "field": "tilt",
                "axis": "tilt"
            }]
        }
    };

    private readonly trackLine = {
        fields: [{
            name: "sysid",
            alias: "sysid",
            type: "oid"
        },
        {
            name: "from_time",
            alias: "from_time",
            type: "long"
        },
        {
            name: "to_time",
            alias: "to_time",
            type: "long"
        }
        ],
        template: {
            title: "Track",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "from_time",
                    label: "from_time",
                    visible: true
                },
                {
                    fieldName: "to_time",
                    label: "to_time",
                    visible: true
                }
                ]
            }]
        },
        renderer2d: {
            authoringInfo: {},
            type: "simple",
            symbol: {
                type: "simple-line",
                width: 5,
                color: [256, 0, 0]
            }
        },
        renderer3d: {
            type: "simple",
            authoringInfo: {},
            symbol: {
                type: "simple-line",
                width: 5,
                color: [256, 0, 0]
            }
        }
    };

    private readonly missionPoint = {
        fields: [{
            name: "seq",
            alias: "seq",
            type: "oid"
        },
        {
            name: "autoContinue",
            alias: "autoContinue"
        },
        {
            name: "command",
            alias: "command",
            type: "integer"
        },
        {
            name: "doJumpId",
            alias: "doJumpId",
            type: "integer"
        },
        {
            name: "frame",
            alias: "frame",
            type: "integer"
        },
        {
            name: "params",
            alias: "params"
        },
        {
            name: "type",
            alias: "type",
            type: "string"
        }
        ],
        template: {
            title: "Mission item {seq}",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "seq",
                    label: "seq",
                    visible: true
                },
                {
                    fieldName: "autoContinue",
                    label: "autoContinue",
                    visible: true
                },
                {
                    fieldName: "command",
                    label: "command",
                    visible: true
                },
                {
                    fieldName: "doJumpId",
                    label: "doJumpId",
                    visible: true
                },
                {
                    fieldName: "frame",
                    label: "frame",
                    visible: true
                },
                {
                    fieldName: "params",
                    label: "params",
                    visible: true
                },
                {
                    fieldName: "type",
                    label: "type",
                    visible: true
                }
                ]
            }]
        },
        renderer2d: {
            type: "unique-value",
            authoringInfo: {},
            field: "type",
            defaultSymbol: {
                type: "simple-marker",
                color: "yellow",
                outline: {
                    color: "yellow",
                    width: "0.5px"
                }
            },
            uniqueValueInfos: [{
                // All features with value of "PlannedHome" will be green
                value: "PlannedHome",
                symbol: {
                    type: "simple-marker",
                    color: "green",
                    outline: {
                        color: "green",
                        width: "0.5px"
                    }
                }
            }]
        },
        renderer3d: {
            type: "unique-value",
            authoringInfo: {},
            field: "type",
            defaultSymbol: {
                type: "point-3d",
                symbolLayers: [{
                    type: "object",
                    width: 4,
                    height: 4, // height of the object in meters
                    depth: 4, // diameter of the object from north to south in meters
                    resource: {
                        primitive: "sphere"
                    },
                    material: {
                        color: [255, 255, 0, 1]
                    }
                }]
            },
            uniqueValueInfos: [{
                // All features with value of "PlannedHome" will be green
                value: "PlannedHome",
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 4, // diameter of the object from east to west in meters
                        height: 4, // height of the object in meters
                        depth: 4, // diameter of the object from north to south in meters
                        resource: {
                            primitive: "sphere"
                        },
                        material: {
                            color: [0, 255, 0, 1]
                        }
                    }]
                }
            }]
        },
        labelClass: {
            symbol: {
                type: "text",
                color: "white",
                haloColor: "black",
                font: {
                    family: "playfair-display",
                    size: 24
                    //weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "$feature.seq"
            }
        }
    };

    private readonly missionLine = {
        fields: [{
            name: "sysid",
            alias: "sysid",
            type: "oid"
        },
        {
            name: "cruiseSpeed",
            alias: "cruiseSpeed",
            type: "integer"
        },
        {
            name: "hoverSpeed",
            alias: "hoverSpeed",
            type: "integer"
        },
        {
            name: "length",
            alias: "length",
            type: "double"
        }
        ],
        template: {
            title: "Mission",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "cruiseSpeed",
                    label: "Cruise speed (m/s)",
                    visible: true
                },
                {
                    fieldName: "hoverSpeed",
                    label: "Hover speed (m/s)",
                    visible: true
                },
                {
                    fieldName: "length",
                    label: "Length (m)",
                    visible: true
                }
                ]
            }]
        },
        renderer2d: {
            type: "simple",
            authoringInfo: {},
            symbol: {
                type: "simple-line",
                width: 2,
                color: [255, 255, 0]
            }
        },
        renderer3d: {
            type: "simple",
            authoringInfo: {},
            symbol: {
                type: "simple-line",
                width: 2,
                color: [255, 255, 0]
            }
        }
    };

    constructor(private viewType: ViewType) { }

    createTrackPointsLayer(tracks: GeoJSON.FeatureCollection): FeatureLayer {
        return new FeatureLayer({
            source: this.createTrackPointsGraphics(tracks),
            fields: this.trackPoint.fields,
            objectIdField: "sysid",
            renderer: this.viewType == ViewType.MapView ? this.trackPoint.renderer2d : this.trackPoint.renderer3d,
            spatialReference: {
                wkid: 4326
            },
            geometryType: "point",
            popupTemplate: this.trackPoint.template
        });
    }

    createTrackLinesLayer(tracks: GeoJSON.FeatureCollection): FeatureLayer {
        return new FeatureLayer({
            source: this.createTrackLinesGraphics(tracks), // autocast as an array of esri/Graphic
            fields: this.trackLine.fields,
            objectIdField: "sysid",
            renderer: this.viewType == ViewType.MapView ? this.trackLine.renderer2d : this.trackLine.renderer3d,
            spatialReference: {
                wkid: 4326
            },
            geometryType: "polyline",
            popupTemplate: this.trackLine.template
        });
    }

    createMissionPointsLayer(plan: UVMissionPlan): FeatureLayer {
        return new FeatureLayer({
            source: this.createMissionPointsGraphics(plan), // autocast as an array of esri/Graphic
            fields: this.missionPoint.fields,
            objectIdField: "sysid",
            renderer: this.viewType == ViewType.MapView ? this.missionPoint.renderer2d : this.missionPoint.renderer3d,
            spatialReference: {
                wkid: 4326
            },
            geometryType: "point",
            popupTemplate: this.missionPoint.template,
            labelingInfo: [this.missionPoint.labelClass]
        });
    }

    createMissionLinesLayer(plan: UVMissionPlan): FeatureLayer {
        return new FeatureLayer({
            source: this.createMissionLinesGraphics(plan), // autocast as an array of esri/Graphic
            fields: this.missionLine.fields,
            objectIdField: "sysid",
            renderer:  this.viewType == ViewType.MapView ? this.missionLine.renderer2d : this.missionLine.renderer3d,
            spatialReference: {
                wkid: 4326
            },
            geometryType: "polyline",
            popupTemplate: this.missionLine.template
        });
    }

    private createTrackPointsGraphics(geoJson: GeoJSON.FeatureCollection): Collection<Graphic> {
        const features = new Collection<Graphic>();

        if (geoJson.features.length == 0)
            return features;

        let feature = geoJson.features[0];
        // Create an array of Graphics from each GeoJSON feature

        let graphics = new Graphic({
            geometry: new Point({
                x: (feature.geometry as GeoJSON.Point).coordinates[0],
                y: (feature.geometry as GeoJSON.Point).coordinates[1],
                z: (feature.geometry as GeoJSON.Point).coordinates[2]
            }),
            attributes: feature.properties
        });

        graphics.attributes.latitude /= 10000000.0;
        graphics.attributes.longitude /= 10000000.0;
        graphics.attributes.heading /= 100.0;
        graphics.attributes.pitch /= 100.0;
        graphics.attributes.roll /= 100.0;
        graphics.attributes.tilt = graphics.attributes.roll - 90;

        features.push(graphics);

        return features;
    }

    private createTrackLinesGraphics(geoJson: GeoJSON.FeatureCollection): Collection<Graphic> {
        let minTime = -1;
        let maxTime = -1;
        let coordinates: number[][] = [];

        for (let i = 0; i < geoJson.features.length; i++) {
            let feature = geoJson.features[i];

            coordinates.push((feature.geometry as GeoJSON.Point).coordinates);

            if (feature.properties) {
                let recordTime = feature.properties.time;

                if (minTime < 0 || recordTime < minTime) {
                    minTime = recordTime;
                }

                if (maxTime < 0 || recordTime > maxTime) {
                    maxTime = recordTime;
                }
            }   
        }

        // Create an array of Graphics from each GeoJSON feature
        const features = new Collection<Graphic>();

        features.push(new Graphic({
            geometry: new Polyline({
                hasZ: true,
                hasM: false,
                paths: [coordinates]
            }),
            attributes: {
                from_time: minTime,
                to_time: maxTime
            }
        }));

        return features;
    }

    private createMissionPointsGraphics(plan: UVMissionPlan): Collection<Graphic> {
        const points = new Collection<Graphic>();

        if (plan.mission == null || plan.mission.plannedHomePosition.length < 3)
            return points;

        // Create an array of Graphics from mission items

        points.push(new Graphic({
            geometry: new Point({
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
                type: "PlannedHome",
                params: []
            }
        }));

        for (let i = 0; i < plan.mission.items.length; i++) {
            let item = plan.mission.items[i];

            if (item.params[5] != 0 && item.params[6] != 0) {
                let point: Point = new Point({
                    x: item.params[5],
                    y: item.params[4],
                    z: item.params[6] + (points.getItemAt(0).geometry as Point).z
                });

                if (item.command == 22) { //takeoff
                    point = new Point({
                        x: points[0].geometry.x,
                        y: points[0].geometry.y,
                        z: points[0].geometry.z + item.params[6]
                    });
                }

                points.push(new Graphic({
                    geometry: point,
                    attributes: {
                        seq: i + 1,
                        command: item.command,
                        autoContinue: item.autoContinue,
                        frame: item.frame,
                        doJumpId: item.doJumpId,
                        type: item.type,
                        params: item.params
                    }
                }));
            }
        }

        return points;
    }

    private createMissionLinesGraphics(plan: UVMissionPlan): Collection<Graphic> {
        const lines = new Collection<Graphic>();

        if (plan.mission == null || plan.mission.plannedHomePosition.length < 3)
            return lines;

        let coordinates: number[][] = [];

        coordinates.push([
            plan.mission.plannedHomePosition[1],
            plan.mission.plannedHomePosition[0],
            plan.mission.plannedHomePosition[2]
        ]);

        for (let i = 0; i < plan.mission.items.length; i++) {
            let item = plan.mission.items[i];
            let z = item.params[6] + plan.mission.plannedHomePosition[2];
            if (item.params[5] != 0 && item.params[6] != 0) {
                if (item.command == 22) //takeoff
                    coordinates.push([plan.mission.plannedHomePosition[1], plan.mission.plannedHomePosition[0], z]);
                else
                    coordinates.push([item.params[5], item.params[4], z]);
            }
        }

        let polyline = new Polyline({
            hasZ: true,
            hasM: false,
            paths: [coordinates]
        });

        let length = geometryEngine.geodesicLength(polyline, "meters");

        // Create an array of Graphics from each GeoJSON feature
        lines.push(new Graphic({
            geometry: polyline,
            attributes: {
                cruiseSpeed: plan.mission.cruiseSpeed,
                hoverSpeed: plan.mission.hoverSpeed,
                length: length
            }
        }));

        return lines;
    }

}