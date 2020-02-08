export const trackPoint = {
    // Set up popup template for the layer
    template: {
        title: 'System {sysid} state',
        expressionInfos: [
            {
                name: 'heading',
                title: 'Heading (degrees)',
                expression: '$feature.heading / 100'
            },
            {
                name: 'heading_sp',
                title: 'Heading setpoint (degrees)',
                expression: '$feature.heading_sp / 100'
            },
            {
                name: 'roll',
                title: 'Roll (degrees)',
                expression: '$feature.roll / 100'
            },
            {
                name: 'pitch',
                title: 'Pitch (degrees)',
                expression: '$feature.pitch / 100'
            }],
        content: [{
            type: 'fields',
            fieldInfos: [
                {
                    fieldName: 'time',
                    label: 'Time',
                    format: {
                        dateFormat: 'short-date-long-time-24'
                    },
                    visible: true
                },
                {
                    fieldName: 'airspeed',
                    label: 'Air speed (m/s)',
                    visible: true
                },
                {
                    fieldName: 'airspeed_sp',
                    label: 'Air speed setpoint (m/s)',
                    visible: true
                },
                {
                    fieldName: 'groundspeed',
                    label: 'Ground speed (m/s)',
                    visible: true
                },
                {
                    fieldName: 'expression/heading',
                    label: 'Heading (decimal degrees)',
                    visible: true
                },
                {
                    fieldName: 'expression/heading_sp',
                    label: 'Heading setpoint (degrees)',
                    visible: true
                },
                {
                    fieldName: 'expression/pitch',
                    label: 'Pitch (degrees)',
                    visible: true
                },
                {
                    fieldName: 'expression/roll',
                    label: 'Roll (degrees)',
                    visible: true
                }, {
                    fieldName: 'altitude_amsl',
                    label: 'Altitude above mean sea level (m)',
                    visible: true
                },
                {
                    fieldName: 'altitude_sp',
                    label: 'Altitude setpoint relative home (m)',
                    visible: true
                },
                {
                    fieldName: 'climb_rate',
                    label: 'Climb rate (m/s)',
                    visible: true
                },
                {
                    fieldName: 'gps_fix_type',
                    label: 'GPS Fix type',
                    visible: true
                },
                {
                    fieldName: 'gps_nsat',
                    label: 'Number of GPS satellites visible',
                    visible: true
                },
                {
                    fieldName: 'battery_remaining',
                    label: 'Battery remaining (%)',
                    visible: true
                },
                {
                    fieldName: 'temperature',
                    label: 'Battery voltage (volts)',
                    visible: true
                },
                {
                    fieldName: 'temperature_air',
                    label: 'Battery 2 voltage (volts)',
                    visible: true
                },
                {
                    fieldName: 'throttle',
                    label: 'Throttle (%)',
                    visible: true
                },
                {
                    fieldName: 'wp_distance',
                    label: 'Distance to target (m)',
                    visible: true
                },
                {
                    fieldName: 'wp_num',
                    label: 'Current waypoint number',
                    visible: true
                },
                {
                    fieldName: 'base_mode',
                    label: 'Bitmap of enabled system modes',
                    visible: true
                },
                {
                    fieldName: 'custom_mode',
                    label: 'Bitfield of autopilot-specific flags',
                    visible: true
                },
                {
                    fieldName: 'failsafe',
                    label: 'Failsafe flags',
                    visible: true
                },
                {
                    fieldName: 'landed_state',
                    label: 'Landed state',
                    visible: true
                }
            ]
        }]
    },
    renderer2d: {
        type: 'simple',
        symbol: {
            type: 'simple-marker',
            path: 'M-29,14.5 0,23.5 -8,14.5 0,5.5z',
            color: 'magenta',
            outline: {
                color: 'magenta',
                width: 0.5
            },
            angle: 0,
            size: 40,
            xoffset: 0,
            yoffset: 0
        },
        visualVariables: [{
            'type': 'rotation',
            'rotationType': 'arithmetic',
            'valueExpression': '-$feature.heading/100',
            'axis': 'heading'
        }]
    },
    renderer3d: {
        type: 'simple',
        symbol: {
            type: 'point-3d', // autocasts as new PointSymbol3D()
            symbolLayers: [{
                type: 'object', // autocasts as new ObjectSymbol3DLayer()
                width: 1, // diameter of the object from east to west in meters
                height: 4, // height of the object in meters
                depth: 3, // diameter of the object from north to south in meters
                heading: 90,
                pitch: 0,
                roll: 90,
                resource: {
                    primitive: 'cone'
                },
                material: {
                    color: 'magenta'
                }
            }]
        },
        visualVariables: [{
            'type': 'rotation',
            'rotationType': 'arithmetic',
            'valueExpression': '-$feature.heading/100 - 90',
            'axis': 'heading'
        }, {
            'type': 'rotation',
            'rotationType': 'arithmetic',
            'valueExpression': '-$feature.roll/100',
            'axis': 'roll'
        }, {
            'type': 'rotation',
            'rotationType': 'arithmetic',
            'valueExpression': '-$feature.pitch/100',
            'axis': 'tilt'
        }]
    }
};

export const trackLine = {
    template: {
        title: 'System {sysid} track',
        content: [{
            type: 'fields',
            fieldInfos: [{
                fieldName: 'from_time',
                label: 'From Time',
                format: {
                    dateFormat: 'short-date-long-time-24'
                },
                visible: true
            },
            {
                fieldName: 'to_time',
                label: 'To Time',
                format: {
                    dateFormat: 'short-date-long-time-24'
                },
                visible: true
            },
            {
                fieldName: 'length',
                label: 'Length (m)',
                format: {
                    places: 0
                },
                visible: true
            }
            ]
        }]
    },
    renderer2d: {
        type: 'simple',
        symbol: {
            type: 'simple-line',
            width: 5,
            color: [256, 0, 0]
        }
    },
    renderer3d: {
        type: 'simple',
        symbol: {
            type: 'simple-line',
            width: 5,
            color: [256, 0, 0]
        }
    }
};

export const missionPoint = {
    template: {
        title: 'System {target_system} mission item {seq}',
        content: [{
            type: 'fields',
            fieldInfos: [{
                fieldName: 'seq',
                label: 'Sequence',
                visible: true
            },
            {
                fieldName: 'autocontinue',
                label: 'Autocontinue',
                visible: true
            },
            {
                fieldName: 'command',
                label: 'Command',
                visible: true
            },
            {
                fieldName: 'current',
                label: 'Current',
                visible: true
            },
            {
                fieldName: 'z',
                label: 'Altitude (m)',
                visible: true
            },
            {
                fieldName: 'frame',
                label: 'Frame',
                visible: true
            },
            {
                fieldName: 'param1',
                label: 'Param 1',
                visible: true
            },
            {
                fieldName: 'param2',
                label: 'Param 2',
                visible: true
            },
            {
                fieldName: 'param3',
                label: 'Param 3',
                visible: true
            },
            {
                fieldName: 'param4',
                label: 'Param 4',
                visible: true
            }
            ]
        }]
    },
    renderer2d: {
        type: 'unique-value',
        field: 'seq',
        defaultSymbol: {
            type: 'simple-marker',
            color: 'yellow',
            outline: {
                color: 'yellow',
                width: '0.5px'
            }
        },
        uniqueValueInfos: [{
            // All features with value of 'PlannedHome' will be green
            value: '1',
            symbol: {
                type: 'simple-marker',
                color: 'green',
                outline: {
                    color: 'green',
                    width: '0.5px'
                }
            }
        }]
    },
    renderer3d: {
        type: 'unique-value',
        field: 'seq',
        defaultSymbol: {
            type: 'point-3d',
            symbolLayers: [{
                type: 'object',
                width: 4,
                height: 4, // height of the object in meters
                depth: 4, // diameter of the object from north to south in meters
                resource: {
                    primitive: 'sphere'
                },
                material: {
                    color: [255, 255, 0, 1]
                }
            }]
        },
        uniqueValueInfos: [{
            // All features with value of 'PlannedHome' will be green
            value: '0',
            symbol: {
                type: 'point-3d',
                symbolLayers: [{
                    type: 'object',
                    width: 4, // diameter of the object from east to west in meters
                    height: 4, // height of the object in meters
                    depth: 4, // diameter of the object from north to south in meters
                    resource: {
                        primitive: 'sphere'
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
            type: 'text',
            color: 'white',
            haloColor: 'black',
            font: {
                family: 'playfair-display',
                size: 24,
                weight: 'bold'
            }
        },
        labelPlacement: 'above-center',
        labelExpressionInfo: {
            expression: '$feature.seq'
        }
    }
};

// Set up popup template for the mission lines layer
export const missionLine = {
    template: {
        title: 'System {target_system} mission',
        content: [{
            type: 'fields',
            fieldInfos: [
                {
                    fieldName: 'length',
                    label: 'Length (m)',
                    format: {
                        places: 0
                    },
                    visible: true
                }
            ]
        }]
    },
    renderer2d: {
        type: 'simple',
        symbol: {
            type: 'simple-line',
            width: 2,
            color: [255, 255, 0]
        }
    },
    renderer3d: {
        type: 'simple',
        symbol: {
            type: 'simple-line',
            width: 2,
            color: [255, 255, 0]
        }
    }
};
