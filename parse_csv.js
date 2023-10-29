"use strict"
const fs = require('fs');

// parse the csv data from the sd card

// VCU Data IDs: taken from sd.c in UMSAE Firmware Repo
const VCU_SD_DATA_IDS = [
	"TIME",				// 00
	"TR_SENS1",			// 01
	"TR_SENS2",			// 02
	"TR_REQUEST",			// 03	
	"SPEED",			// 04
	"SPEED_PER",			// 05
	"N_CMD",			// 06
	"N_CMD_PER",			// 07
	"N_CMD_RAMP",			// 08
	"N_CMD_RAMP_PER",		// 09
	"N_ERROR",			// 10
	"N_ERROR_PER",			// 11
	"I_CMD",			// 12
	"I_CMD_RAMP",			// 13
	"I_ACTUAL",			// 14
	"V_D",				// 15
	"V_Q",				// 16
	"V_OUT",			// 17
	"MOTOR_TEMP",			// 18
	"IGBT_TEMP",			// 19
	"AIR_TEMP",			// 20
	"TORQUE_CMD",			// 21
	"BUS_V",			// 22
	"BUS_V_PER",			// 23
	"FR_WHEEL_SPEED",		// 24
	"FL_WHEEL_SPEED",		// 25
	"BRAKE_ENCODER_1",		// 26
	"BRAKE_ENCODER_2",		// 27
	"MC RPM",                       // 28
	"BNO055_ACCEL_X",               // 29
	"BNO055_ACCEL_Y",               // 30
	"BNO055_ACCEL_Z",               // 31
	"BNO055_GYRO_X",                // 32
	"BNO055_GYRO_Y",                // 33
	"BNO055_GYRO_Z",                // 34
        "VBATT",			// 35
	"IC_temp",			// 36
];

/*
function parse_csv_file(filename) {
    const contents = {};
    
    fs.readFile(filename, {encoding: 'utf-8'}, function(err,data){
	if (!err) {
	    // console.log('received data: ' + data);
	} else {
	    console.log(err);
	}
    });
}
*/

function parse_csv_file(data) {
    let parsed_data = {};
    
    const lines = data.split('\n');

    const headers = lines[0].split(','); // Header is the first line
    const values = lines.slice(1).map(x => x.split(','));  // Values are the 2nd to nth 

    // Add all header names to dictionary
    headers.forEach((key) => {
	parsed_data[key] = [];
    });

    // Add each line's values to their corresponding header value
    values.forEach((xs) => {
	for(let i = 0; i < headers.length; i++) {
	    const header = headers[i];
	    const value = xs[i];
	    parsed_data[header].push(value);
	}
    });

    console.log(parsed_data);

    return parsed_data;
}

function create_dummy_csv_contents(lines=100) {
    const header = VCU_SD_DATA_IDS.join(',');
    let data_lines = [];
    
    for(let i = 0; i < lines; i++) {
	data_lines.push(VCU_SD_DATA_IDS.map(_ => Math.random()).join(","));
    }

    return header + '\n' + data_lines.join('\n');
}

parse_csv_file(create_dummy_csv_contents(10));
