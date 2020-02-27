let canvas, engine, scene
let light1, light2

window.onload = function() {
    canvas = document.getElementById("renderCanvas")
    engine = new BABYLON.Engine(canvas, true)
    scene = new BABYLON.Scene(engine)
    camera = new BABYLON.ArcRotateCamera("Camera",
         .7,1.4, 60, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)

    light1 = new BABYLON.HemisphericLight("light1", 
        new BABYLON.Vector3(0, 1, 0.3), scene)
    light2 = new BABYLON.PointLight("light2", 
        new BABYLON.Vector3(5, 50, 30), scene)
    light2.parent = camera

    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        {diameter:20}, scene)
    sphere.position.y = 10
    let mat
    mat = sphere.material = new BABYLON.StandardMaterial('sphere-mat', scene)
    mat.diffuseColor.set(0.9,0.2,0.7)
    mat.specularColor.set(0.3,0.3,0.3)
    mat.specularPower = 120


    let cube = BABYLON.MeshBuilder.CreateBox("box",
        {size:20}, scene)
    cube.position.y = -10
    mat = cube.material = new BABYLON.StandardMaterial('sphere-mat', scene)
    mat.diffuseColor.set(0.1,0.7,0.9)
    
    engine.runRenderLoop(function () {  scene.render() })
    window.addEventListener("resize", function () { engine.resize() } )
}

