const parser = new DOMParser();
import * as L from "leaflet";
// import { setTimeout } from 'timers/promises';
import 'leaflet/dist/leaflet.css';
var map = L.map('map').setView([51.5, -115.5], 6);

var basemaps = {
    Topography: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
};

var lyers = {
    'Temp': L.tileLayer.wms('https://geo.weather.gc.ca/geomet/', {
        layers: 'RDPS.ETA_TT',
        transparent: true,
        // format: 'image/png',
        // format: 'image/tiff',
        opacity: 0.6
    }),
    'RH': L.tileLayer.wms('https://geo.weather.gc.ca/geomet/', {
        layers: 'RDPS.ETA_HR',
        transparent: true,
        // format: 'image/png',
        opacity: 0.1
    }),
    'WindSpeed': L.tileLayer.wms('https://geo.weather.gc.ca/geomet/', {
        layers: 'RDPS.ETA_WSPD',
        transparent: true,
        // format: 'image/png',
        opacity: 0.1
    }),
    'WindDirection': L.tileLayer.wms('https://geo.weather.gc.ca/geomet/', {
        layers: 'RDPS.ETA_WD',
        transparent: true,
        // format: 'image/png',
        opacity: 0.1
    })
}

var control = L.control.layers(basemaps, lyers).addTo(map);
// console.log(basemaps);
basemaps.Topography.addTo(map);
// lyers.Temp.addTo(map);
// lyers.Temp.addTo(map);
//   console.log(control.getActiveBaseLayer().name)
console.log('o', control);

var popup = L.popup();

function onMapClick(e) {
    console.log('onMapClick' + e);
    console.log(e);
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    alert("e.latlng is-- " + e.latlng.toString())

    map.eachLayer(function (layer) {
        const v = lyers.bindPopup;
        console.log('Thisis ', v);

    });
}


map.on('click', onMapClick);

map.on('overlayadd', function (eo) {
    layerSelected = eo.name;
    console.log(eo);
});

// map.on('baselayerchange', function (e) {
//     currentLayerID = e.layer._leaflet_id;
//     console.log('currentLayerID '+ currentLayerID); 
//  });

/* Async function used to retrieve start and end time from GDPS.ETA_TT layer GetCapabilities document */
async function getMSCStartEndTime() {
    let response = await fetch(
        "https://geo.weather.gc.ca/geomet/?lang=en&service=WMS&request=GetCapabilities&version=1.3.0&LAYERS=RDPS.ETA_TT"
    );
    let data = await response
        .text()
        .then((data) =>
            parser
                .parseFromString(data, "text/xml")
                .getElementsByTagName("Dimension")[0]
                .innerHTML.split("/")
        );
    console.log(data);
    return [new Date(data[0]), new Date(data[1])];
}

let frameRate = 1.0; // frames per second
let animationId = null;
let startTime = null;
let endTime = null;
let current_time = null;
let layerSelected = "";

function updateInfo(current_time) {
    let el = document.getElementById("info");
    el.innerHTML = `Time / Heure (UTC): ${current_time.toISOString()}`;
}

function setTime() {
    current_time = current_time;
    if (current_time === null) {
        current_time = startTime;
    } else if (current_time >= endTime) {
        current_time = startTime;
    } else {
        current_time = new Date(
            current_time.setMinutes(current_time.getMinutes() + 60)
        );
    }
    // map.
    // layers[1]
    //     .getSource()
    //     .updateParams({ TIME: current_time.toISOString().split(".")[0] + "Z" });
    // layers[2]
    //     .getSource()
    //     .updateParams({ TIME: current_time.toISOString().split(".")[0] + "Z" });    
    updateInfo(current_time);
}

var myVar;

function myFunction() {
    myVar = setTimeout(alertFunc, 3000);
}

function alertFunc() {
    alert("Hello!");
}

function playTime() {
    setTime()
    // console.log(layerSelected)
    console.log(current_time.toISOString().split(".")[0] + "Z");
    const vParams = {
        TIME: current_time.toISOString().split(".")[0] + "Z"
        // TIME: "2021-06-10T00:00:00Z"
        // TIME: "2021-12-10T00:00:00Z"
    }
    let resp = lyers.Temp.setParams(vParams);
    console.log(resp);
    resp.addTo(map)
    // lyers.Temp.addTo(map);
    // alert("Proceed");
    return new Promise((resolve, reject) => {
        resolve();
    })
}

getMSCStartEndTime().then((data) => {
    startTime = data[0];
    endTime = data[1];
    console.log('startTime' + startTime);
    console.log('endTime' + endTime);
    setTime();
});

let stop = function () {
    if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
    }
};

let play = async function () {
    stop();
    animationId = await window.setInterval(playTime, 11000 / frameRate);
    setTimeout(() => {
        console.log("Waited for 10 Seconds")
    }, 100000);
};

let startButton = document.getElementById("play");
startButton.addEventListener("click", play, false);

let stopButton = document.getElementById("pause");
stopButton.addEventListener("click", stop, false);