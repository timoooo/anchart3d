/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import SceneInit from './SceneInit';
import Chart from './../Chart';


export default function createChart (domTarget) {
    let scene;
    let configuration;
    let chart;
    let chartType;
    let chartData;

    let options = {
        domTarget: domTarget
    };

    return {
        setConfig: function (configJson) {
            options.configurationJson = configJson;
            return this;
        },
        setChart: function (chartType) {
            options.chartType = chartType;
            return this;
        },
        chartData: function (json) {
            options.chartData = json;
            return this;
        },
        draw: function () {
            //check config to either filter incorrect config parameters, or pass default config
            configuration = checkConfig(options.configurationJson);
            chartType = options.chartType;
            chartData = options.chartData;

            if (chartType && chartData) {

                chart = new Chart(chartType, chartData, configuration)
                    .createChart();

                if (configuration) { //if config for the sceneInit is available
                    scene = new SceneInit(domTarget, configuration);
                }
                else { //else use default sceneInit settings
                    scene = new SceneInit(domTarget);
                }
                scene.initScene();
                scene.animate();
                scene.scene.add(chart.object);

            }
            else {
                throw "API Error: ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!";
            }
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
            else if(propKey === "sortDataBy"){
                if(typeof configJson[propKey] === "string" && ["data1","data2"].indexOf(configJson[propKey]) >= 0){
                    validConfig[propKey] = configJson[propKey];
                }
                else{
                    console.warn("Invalid type for property \"" + propKey + "\": Type has to be \"string\"!\nProperty was set to \"undefined\"!");
                    validConfig[propKey] = undefined;
                }
            }
            else if(["sortDataBy","fov","bgcolor"].indexOf(propKey) < 0 && typeof configJson[propKey] !== "boolean"){//if other config params are not boolean, they are set to false automatically
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