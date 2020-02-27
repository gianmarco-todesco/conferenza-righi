let canvas, engine, scene
let light1, light2
let cubes

function createCube() {
    let firstFace = BABYLON.MeshBuilder.CreateBox('face', {
        width:1.95,height:0.1,depth:1.95
    },scene)
    let faces = []
    for(let i=1;i<6;i++) {
        let face = firstFace.createInstance('inst-'+i)
        face.setPivotPoint(new BABYLON.Vector3(1,0,0))
        faces.push(face)
    }
    for(let i=0; i<4; i++) {
        let face = faces[i]
        let p = new BABYLON.Mesh('p', scene)
        p.parent = firstFace
        p.rotation.y = (i+1)*Math.PI/2
        face.parent = p
    }

    
    let face = faces[4]
    let p = new BABYLON.Mesh('p', scene)
    p.parent = faces[0]
    p.rotation.y = Math.PI
    p.rotation.x = Math.PI
    face.parent = p
    
    firstFace.setAperture = function(aperture) {
        let angle = aperture * Math.PI * 0.5 + Math.PI * 0.5 
        faces.forEach((face,i) => { face.rotation.z = -angle  })
    }    
    return firstFace
}


function populateScene() {
    cubes = []
    createGrid(scene)

    
    let cube = createCube()
    cubes.push(cube)

    let mat1 = cube.material = new BABYLON.StandardMaterial('mat', scene)
    mat1.diffuseColor.set(0.4,0.7,0.9)
    mat1.specularColor.set(0.1,0.1,0.1)

    let cube2 = createCube()
    cubes.push(cube2)

    cube2.position.y = 0.2
    cube2.rotation.y = Math.PI/2
    cube2.scaling.set(0.8,0.8,0.8)

    let mat2 = cube2.material = new BABYLON.StandardMaterial('mat', scene)
    mat2.diffuseColor.set(0.3,0.9,0.2)
    mat2.specularColor.set(0.1,0.1,0.1)

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
    let t = performance.now() * 0.0001
    t -= Math.floor(t)

    let t1 = smooth(subrange(t,0.1,0.3)) - smooth(subrange(t,0.7,0.9))
    cubes[0].setAperture(t1)
    let t2 = smooth(subrange(t,0.3,0.4)) - smooth(subrange(t,0.5,0.7))
    cubes[1].setAperture(t2)
    
    /*
    let t2 = smooth(subrange(0.2,0.8))
    cubes[1].setAperture(t1)
    */

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

