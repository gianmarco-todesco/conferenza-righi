let canvas, engine, scene
let light1, light2
let faces

function populateScene() {
    createGrid(scene)

    let mat = new BABYLON.StandardMaterial('mat', scene)
    mat.diffuseColor.set(0.4,0.7,0.9)
    mat.specularColor.set(0.1,0.1,0.1)

    faces = []
    for(let i=0;i<6;i++) {
        let face = BABYLON.MeshBuilder.CreateBox('face', {
            width:1.95,height:0.1,depth:1.95
        },scene)
        face.material = mat
        face.setPivotPoint(new BABYLON.Vector3(1,0,0))
        faces.push(face)


    }

    for(let i=1; i<=4; i++) {
        let face = faces[i]
        let p = new BABYLON.Mesh('p', scene)
        p.parent = face[0]
        p.rotation.y = i*Math.PI/2
        face.parent = p
    }

    let face = faces[5]
    let p = new BABYLON.Mesh('p', scene)
    p.parent = faces[1]
    p.rotation.y = Math.PI
    p.rotation.x = Math.PI
    face.parent = p
/*
    let face = faces[5]
    face.setPivotMatrix(
        BABYLON.Matrix.RotationAxis(yAxis,-Math.PI/2)
        .multiply(BABYLON.Matrix.Translation(1,0,0)))
    face.parent = faces[1]
    face.rotation.z = -2.3
*/


    /*
    let p
    for(let i=1; i<=4; i++) {
        p = new BABYLON.Mesh('p',scene)
        p.parent = faces[0]
        p.rotation.y = i*Math.PI/2
        faces[i].parent = p
        faces[i].setPivotPoint(new BABYLON.Vector3(1,0,0))
        faces[i].rotation.z = -2*Math.PI/3    
    }

    p = new BABYLON.Mesh('p',scene)
    p.parent = faces[1]
    p.rotation.y = Math.PI/2

    faces[5].parent = p
    faces[5].setPivotPoint(new BABYLON.Vector3(1,0,0))
    faces[5].rotation.z = -2*Math.PI/3    
*/

}

function tick() {
    let angle = (Math.sin(performance.now()*0.001) * 0.5 + 1.5) * Math.PI * 0.5;
    faces.forEach((face,i) => {
        if(i>0) {
            face.rotation.z = -angle
        }
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

