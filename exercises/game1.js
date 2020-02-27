// Gian Marco Todesco
// https://github.com/gianmarco-todesco/conferenza-righi
//

let canvas, engine, scene
let light1, light2
let cube
let vertices
let color1 = new BABYLON.Color3(0.7,0.3,0.1)
let color2 = new BABYLON.Color3(0.2,0.6,0.9)

function populateScene() {
    // createGrid(scene)
    cube = BABYLON.MeshBuilder.CreateBox('box', {size:2}, scene)
    cube.material = new BABYLON.StandardMaterial('mat',scene)
    cube.material.diffuseColor.set(0.4,0.6,0.5)
    
    positions = [
        [-1,-1,-1],
        [-1,-1, 1],
        [-1, 1,-1],
        [-1, 1, 1],
        [ 1,-1,-1],
        [ 1,-1, 1],
        [ 1, 1,-1],
        [ 1, 1, 1],        
    ]

    neighbours = [
        [0,1,2,4],
        [1,0,3,5],
        [2,0,3,6],
        [3,1,2,7],
        [4,5,6,0],
        [5,4,7,1],
        [6,2,7,4],
        [7,5,6,3]        
    ]

    var animation = new BABYLON.Animation(
        "myAnimation", 
        "material.diffuseColor", 
        30, 
        BABYLON.Animation.ANIMATIONTYPE_COLOR3, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
     );
     animation.setKeys([
        {frame:0, value:color1},
        {frame:15, value:new BABYLON.Color3(0.5,0.5,0.5)},
        {frame:30, value:color2}]);
    
    vertices = []
    for(let i=0;i<8; i++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere('box', {size:0.5}, scene)
        sphere.position.x = positions[i][0]
        sphere.position.y = positions[i][1]
        sphere.position.z = positions[i][2]
        sphere.material = new BABYLON.StandardMaterial('mat', scene)
        sphere.material.diffuseColor.copyFrom(color1)
        vertices.push(sphere)
        sphere.status = 1
        sphere.neighbours = neighbours[i]

        sphere.animations = [];
        sphere.animations.push(animation);
    

        sphere.flipStatus = function(s) {
            sphere.neighbours.forEach(i => {
                let sph  = vertices[i]
                let status = sph.status = 3 - sph.status
                if(status==2) scene.beginAnimation(sph, 0, 30, true); 
                else scene.beginAnimation(sph, 30, 0, true); 
            })
        }
    }    

    scene.onPointerObservable.add(pointerInfo => {
        if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
            if(pointerInfo.pickInfo.pickedMesh) {
                let sphere = pointerInfo.pickInfo.pickedMesh
                if(sphere.status !== undefined) {
                    sphere.flipStatus()
                }
            }
        }
    })
}


function tick() {
    let sc = 1 + 0.05*Math.sin(performance.now()*0.002)
    cube.scaling.set(sc,sc,sc)
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
        new BABYLON.Vector3(0, 0, 0), scene)
    light2.parent = camera

    populateScene()

    scene.registerBeforeRender(tick)
    engine.runRenderLoop(function () {  scene.render() })
    // window.addEventListener("resize", function () { engine.resize() } )
}

