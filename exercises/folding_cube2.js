// Gian Marco Todesco
// https://github.com/gianmarco-todesco/conferenza-righi
//

let canvas, engine, scene
let light1, light2
let cubes

function createFoldingCube() {
    // crea la prima faccia
    let firstFace = BABYLON.MeshBuilder.CreateBox('face', {
        width:1.95,height:0.1,depth:1.95
    },scene)
    // e le altre
    let faces = []
    for(let i=1;i<6;i++) {
        // le facce secondarie sono delle copie della prima faccia
        // (questo velocizza il rendering)
        let face = firstFace.createInstance('inst-'+i)
        face.setPivotPoint(new BABYLON.Vector3(1,0,0))
        faces.push(face)
    }
    // attacco le prime 4 facce secondarie alla faccia principale
    for(let i=0; i<4; i++) {
        let face = faces[i]
        let p = new BABYLON.Mesh('p', scene)
        p.parent = firstFace
        p.rotation.y = (i+1)*Math.PI/2
        face.parent = p
    }
    // ... e l'ultima faccia secondaria alla prima
    
    let face = faces[4]
    let p = new BABYLON.Mesh('p', scene)
    p.parent = faces[0]
    p.rotation.y = Math.PI
    p.rotation.x = Math.PI
    face.parent = p
    
    // associo alla prima faccia (che rappresenta l'intero cubo)
    // una funzione setAperture() che apre e chiude il cubo
    firstFace.setAperture = function(aperture) {
        let angle = aperture * Math.PI * 0.5 + Math.PI * 0.5 
        faces.forEach((face,i) => { face.rotation.z = -angle  })
    }    
    return firstFace
}


function populateScene() {
    cubes = []
    createGrid(scene)

    // creo il primo cubo
    let cube = createFoldingCube()
    cubes.push(cube)

    // e il relativo materiale
    let mat1 = cube.material = new BABYLON.StandardMaterial('mat', scene)
    mat1.diffuseColor.set(0.4,0.7,0.9)
    mat1.specularColor.set(0.1,0.1,0.1)

    // il secondo cubo
    let cube2 = createFoldingCube()
    cubes.push(cube2)
    let mat2 = cube2.material = new BABYLON.StandardMaterial('mat', scene)
    mat2.diffuseColor.set(0.3,0.9,0.2)
    mat2.specularColor.set(0.1,0.1,0.1)

    // il secondo cubo è ruotato, un po' rimpicciolito e spostato 
    // rispetto al primo cubo
    cube2.position.y = 0.2
    cube2.rotation.y = Math.PI/2
    cube2.scaling.set(0.8,0.8,0.8)
}

function tick() {
    // t è il tempo dall'inizio. Un'unità = 10 secondi
    let t = performance.now() * 0.0001
    // faccio in modo che t sia sempre compreso fra 0 e 1.
    t -= Math.floor(t)

    // t1 controlla il movimento del primo cubo
    // comincia ad aprirsi quanto t=0.1 ed è aperto per t=0.3
    // comincia a chiudersi a t=0.7 ed è completamente chiuso a t=0.9
    let t1 = smooth(subrange(t,0.1,0.3)) - smooth(subrange(t,0.7,0.9))
    cubes[0].setAperture(t1)

    // analogamente per il secondo cubo
    let t2 = smooth(subrange(t,0.3,0.4)) - smooth(subrange(t,0.5,0.7))
    cubes[1].setAperture(t2)
}

// solite cose (canvas, engine, camera, ecc.)
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

