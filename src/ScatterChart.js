/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import Chart from './Chart';
import Axis from './utils/Axis';
import {animateZ} from "./utils/animation";
var THREE = require('three');
THREE.orbitControls = require('three-orbit-controls')(THREE);


class ScatterChart {

    constructor(name, type, jsonData, sceneConfig) {
        this.name = name;
        this.type = type;
        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.legendMap = new Map();
        this.object = this.create3DScatterChart();

    }


    scaleNum(value){
        let decimalScale = value.toString().substr(1).length;
        if(decimalScale < 1){
            return 1;
        }
        else return Number("1" + "0".repeat(decimalScale));
    }

    createEntity(x,y,z,size,xMax,yMax,zMax,sizeMax,shape){
        let geometry = new THREE.SphereGeometry(size/this.scaleNum(sizeMax), 32, 32, 3.3);
        let material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        let sphere = new THREE.Mesh(geometry, material);
        //positioning from -10 (0%) to +10 (100%)
        sphere.position.x = -10 + (20*((x/this.scaleNum(xMax))/10));
        sphere.position.y = -10 + (20*((y/this.scaleNum(yMax))/10));
        sphere.position.z = -10 + (20*((z/this.scaleNum(zMax))/10));

        return sphere;
    }


    create3DScatterChart(jsonData = this.jsonData){
        const calculatedData = jsonData.file;
        //calculate max values
        const xMax = Math.max.apply(Math,this.jsonData.file.map(function (o) {return o.values[0].value}));
        const yMax = Math.max.apply(Math,this.jsonData.file.map(function (o) {return o.values[1].value}));
        const zMax = Math.max.apply(Math,this.jsonData.file.map(function (o) {return o.values[2].value}));
        const sizeMax = Math.max.apply(Math,this.jsonData.file.map(function (o) {return o.values[3].value}));

        //Group together all pieces
        let scatterChart = new THREE.Group();
        let axisLines = new THREE.Object3D();
        let labels = new THREE.Group();
        let axisHelper = new Axis();
        scatterChart.chartType = this.type;
        scatterChart.name = this.name;

        //iterate over the jsonData and create for every data a new entity
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let entity;
            let posX, posY, posZ, size;

            for(let value = 0; value < values.length; value++){
                if(values[value].name.toUpperCase().endsWith("X")) posX = values[value].value;
                if(values[value].name.toUpperCase().endsWith("Y")) posY = values[value].value;
                if(values[value].name.toUpperCase().endsWith("Z")) posZ = values[value].value;
                if(values[value].name.toUpperCase().endsWith("SIZE")) size = values[value].value;
            }

            entity = this.createEntity(posX,posY,posZ,size,xMax,yMax,zMax,sizeMax);
            entity.name = calculatedData[dataset].name;
            this.legendMap.set(calculatedData[dataset].name, entity.material.color.getHexString());

            for(let value = 0; value < values.length; value++){
                entity["data"+value] = {};
                entity["data"+value].name = values[value].name;
                entity["data"+value].value = values[value].value;
                entity["data"+value].percent = values[value].percent;
            }

            scatterChart.add(entity);
        }

        //create new grid for scatter chart
        axisHelper.scatterAxisDrawer(axisLines);
        scatterChart.add(axisLines);
        scatterChart.add(labels);
        return scatterChart;
    }
}


export default ScatterChart
