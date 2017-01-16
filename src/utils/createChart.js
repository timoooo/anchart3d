/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import SceneInit from './SceneInit';
import Chart from './../Chart';
import JsonData from "./JsonData";


export default function createChart (domTarget) {
    let scene;
    let configJson;
    let chart;
    let chartType;
    let chartData = [];

    let options = {
        domTarget: domTarget,
        chartData: chartData
    };

    return {
        setConfig: function (configJson) {
            options.configJson = configJson;
            return this;
        },
        pieChart: function () {
            if(!options.chartType){
                options.chartType = "pieChart";
            }
            else console.warn("Chart type was already set!\nIgnoring additional chart method in API");
            return this;
        },
        chartData: function (jsonData, sortBy) {
            if(sortBy){
                options.chartData.push(new JsonData(jsonData).sortData(sortBy));
            }
            else {
                options.chartData.push(new JsonData(jsonData));
            }
            return this;
        },
        draw: function () {
            //check config to either filter incorrect config parameters, or pass default config
            configJson = checkConfig(options.configJson);
            chartType = options.chartType;
            chartData = options.chartData;

            if(document.getElementById(domTarget)) {
                if (chartType && chartData) {

                    chart = new Chart(chartType, chartData[0], configJson)
                        .createChart();
                    //define type of chart...necessary for live data swapping
                    chart.object.chartType = chartType;

                    if (configJson) { //if config for the sceneInit is available
                        scene = new SceneInit(domTarget, chartData , configJson);
                    }
                    else { //else use default sceneInit settings
                        scene = new SceneInit(domTarget, chartData);
                    }
                    scene.initScene();
                    scene.animate();
                    scene.scene.add(chart.object);
                }
                else throw "API Error: ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!";

            }
            else throw "API Error: Element with id \"" + domTarget + "\" not found!";
        }
    };
};


function checkConfig(configJson) {
    let validConfig = {};
    if(configJson){
        Object.keys(configJson).forEach(function (propKey) {
            if(propKey === "fov"){
                if(isNaN(configJson[propKey]))
                    console.warn("Invalid type for property \"" + propKey + "\" : Type has to be 'integer'!\nProperty was set to default value!");
                else validConfig[propKey] = configJson[propKey];
            }
            else if(["fov","bgcolor"].indexOf(propKey) < 0 && typeof configJson[propKey] !== "boolean"){//if other config params are not boolean, they are set to false automatically
                console.warn("Invalid type for property \"" + propKey + "\": Type has to be \"boolean\"!\nProperty was set to \"false\"!");
                validConfig[propKey] = false;
            }
            else{
                validConfig[propKey] = configJson[propKey];
            }
        });
        return validConfig;
    }
    else{//check if valid types are used for config properties
        console.warn("No configuration passed for Scene.\nUsing default configuration!");
        return validConfig; //return empty object to use default config in SceneInit
    }
}