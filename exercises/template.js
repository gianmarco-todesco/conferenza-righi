let canvas, engine, scene
let light1, light2



function populateScene() {
    createGrid(scene)

}

function tick() {

}

window.onload = function() {
    canvas = document.getElementById("renderCanvas")
    engine = new BABYLON.Engine(canvas, true)
    scene = new BABYLON.Scene(engine)
    camera = new BABYLON.ArcRotateCamera("Camera",
         .7,0.9, 10, BABYLON.Vector3.Zero(), scene)
    camera.wheelPrecision = 30
    camera.lowerRadiusLimit = 2.5

    camera.attachControl(canvas, true)

    light1 = new BABYLON.HemisphericLight("light1", 
        new BABYLON.Vector3(0, 1, 0.3), scene)
    light2 = new BABYLON.PointLight("light2", 
        new BABYLON.Vector3(5, 50, 30), scene)
    light2.parent = camera

    populateScene()

    scene.registerBeforeRender(tick)
    engine.runRenderLoop(function () {  scene.render() })
    window.addEventListener("resize", function () { engine.resize() } )
}

