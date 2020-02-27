let canvas, engine, scene
let light1, light2

let cubes

function populateScene() {
    createGrid(scene)
    spheres = []
    let m = 65
    for(let i=0;i<m;i++) {

        let sphere  = BABYLON.MeshBuilder.CreateSphere('s',{
            diameter:0.3
        },scene)
        let t = i/(m-1)
        sphere.position.x = (-1+2*t)*5
        spheres.push(sphere)

        let mat = sphere.material = new BABYLON.StandardMaterial('mat', scene)
        let color = HSVtoRGB(t*0.5,1,1)
        mat.diffuseColor.set(color[0], color[1], color[2])
    }
}

function tick() {
    let time = performance.now()*0.0001
    spheres.forEach((sphere,i) => {
        sphere.position.y = 0.7*Math.sin(time*i)
    })
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

