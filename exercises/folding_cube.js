// Gian Marco Todesco
// https://github.com/gianmarco-todesco/conferenza-righi
//
let canvas, engine, scene
let light1, light2
let faces

function populateScene() {
    createGrid(scene)

    // creo il materiale
    let mat = new BABYLON.StandardMaterial('mat', scene)
    mat.diffuseColor.set(0.4,0.7,0.9)
    mat.specularColor.set(0.1,0.1,0.1)

    // le sei facce (0-5)
    faces = []
    for(let i=0;i<6;i++) {
        let face = BABYLON.MeshBuilder.CreateBox('face', {
            width:1.95,height:0.1,depth:1.95
        },scene)
        face.material = mat
        face.setPivotPoint(new BABYLON.Vector3(1,0,0))
        faces.push(face)
    }

    // le facce 1-4 sono collegate alla 0
    for(let i=1; i<=4; i++) {
        let face = faces[i]
        let p = new BABYLON.Mesh('p', scene)
        p.parent = face[0]
        p.rotation.y = i*Math.PI/2
        face.parent = p
    }

    // la faccia 5 è collegata alla 1
    let face = faces[5]
    let p = new BABYLON.Mesh('p', scene)
    p.parent = faces[1]
    p.rotation.y = Math.PI
    p.rotation.x = Math.PI
    face.parent = p
}

function tick() {
    // time: numero di secondi dall'inizio
    let time = performance.now()*0.001
    // apertura va da 0 a 1 e viceversa
    let aperture = Math.sin(time) * 0.5 + 0.5
    // l'angolo va da Math.PI/2 (cubo chiuso) a Math.PI (cubo aperto) 
    let angle = (aperture + 1) * Math.PI * 0.5;
    // ruota le facce 1..5
    for(let i=1; i<6; i++) faces[i].rotation.z = -angle    
}

// quando la pagina è completamente caricata
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
