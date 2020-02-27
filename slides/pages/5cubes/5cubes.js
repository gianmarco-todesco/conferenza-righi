// Gian Marco Todesco
// https://github.com/gianmarco-todesco/conferenza-righi
//
"use strict";

const slide = {
    name: '5cubes'
}

var Vector3 = BABYLON.Vector3;
var Color4 = BABYLON.Color4;
var cubes = [];

// calcolo l'angolo di inclinazione tale che i cubi si incastrino
// in modo corretto
var theta = Math.PI/4 - Math.asin(1/Math.tan(Math.PI*2/5)/Math.sqrt(2));

// questa funzione viene chiamata quando la pagina 
// è stata completamente caricata nel browser.
// crea l'engine (il componente che fa i disegni), la scena
// ecc.
function setup() {
    let canvas = slide.camera = document.getElementById("renderCanvas");
    let engine = slide.engine = new BABYLON.Engine(canvas, true);
    let scene = slide.scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.2,0.2,0.2);
    
    // camera
    let camera = slide.camera = new BABYLON.ArcRotateCamera(
        "camera1", 0.0 ,1.0,10, 
        BABYLON.Vector3.Zero(), 
        scene);
    camera.wheelPrecision = 50
    camera.attachControl(canvas, false);
    // luce
    var light = new BABYLON.PointLight(
        "light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .9;
    light.parent = camera;
    
    // elementi da visualizzare
    createGrid();
    createCubes();

    scene.registerBeforeRender(animateCubes)
    // faccio partire il renderloop    
    engine.runRenderLoop(function () { scene.render(); });   
    // informo l'engine se la finestra del browser viene ridimensionata
    window.addEventListener('resize', onResize)
}

function onResize(){ engine.resize() }   

// funzione chiamata quando si cambia slide
function cleanup() {
    window.removeEventListener("resize", onResize)
    slide.engine.stopRenderLoop()
    slide.scene.dispose
    delete slide.scene
    slide.engine.dispose
    delete slide.engine   
}

// creo i 5 cubi
function createCubes() {
    const scene = slide.scene
    // i colori dei 5 cubi
    var cc = [
        [0.8,0.3,0.3],
        [0.8,0.6,0.3],
        [0.8,0.8,0.3],
        [0.2,0.8,0.3],
        [0.2,0.8,0.75],
        [0.75,0.2,0.75],
        ];
    cubes = []
    for(var i=0;i<5;i++) {
        // creo il cubo i-esimo
        var cube = BABYLON.MeshBuilder.CreateBox(
            'c',{size:2},scene);
        // gli assegno il colore
        cube.material = new BABYLON.StandardMaterial();
        cube.material.diffuseColor.set(cc[i][0],cc[i][1],cc[i][2]);
        // aggiungo il cubo alla lista di cubi
        cubes.push(cube);        
    }
}


// controllo il movimento dei 5 cubi
function animateCubes() {
    const scene = slide.scene

    // il parametro t controlla la roto-traslazione dei cubi
    // varia periodicamente fra -0.5 e 1.5
    var t = 0.5+1.0*Math.sin(performance.now()*0.001);
    // faccio in modo che t vari fra 0 e 1. 
    // questo assicura che le due configurazioni estreme 
    // rimangano ferme per qualche secondo
    t = Math.max(0, Math.min(1, t));
    // r è la distanza dei cubi dall'asse centrale
    var r = (1-t)*3;
    // roto-traslo i 5 cubi
    for(var i=0;i <5; i++) {
        var cube = cubes[i];
        // calcolo l'angolo azimutale del cubo i-esimo
        var phi = 2*Math.PI*i/5;
        // modifico la posizione
        cube.position.set(
            Math.cos(-phi+Math.PI/2)*r,
            0,
            Math.sin(-phi+Math.PI/2)*r);
        // e la rotazione
        cube.rotation.x = theta*t;
        cube.rotation.y = phi;
    }    
}
