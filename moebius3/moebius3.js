        
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 
    -Math.PI/2, 0.7, 20, new BABYLON.Vector3(0, 0, 0), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, false);
camera.wheelPrecision = 50;
var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0.1,1,-0.1), scene);

var frontLight = new BABYLON.PointLight('a', new BABYLON.Vector3(0,0,0), scene)
frontLight.parent = camera
frontLight.intensirty = 0.5

window.addEventListener("resize", () => engine.resize())

        
var redMat = new BABYLON.StandardMaterial("redMat", scene);
redMat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);

var greenMat = new BABYLON.StandardMaterial("greenMat", scene);
greenMat.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);

var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
blueMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);

var cyanMat = new BABYLON.StandardMaterial("cyanMat", scene);
cyanMat.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.8);

var yellowMat = new BABYLON.StandardMaterial("yellowMat", scene);
yellowMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.2);
yellowMat.backFaceCulling = false;

var m = 3;

/*
var loader = new BABYLON.AssetsManager(scene)
loader.addMeshTask("box","","viper\\","Viper-mk-IV-fighter.obj")
loader.load()
*/

let ships = []

let mymeshes = null
let ship = null
BABYLON.SceneLoader.ImportMesh("", "./", "star-wars-vader-tie-fighter.babylon", scene, function (meshes) {          
         console.log(meshes)
         mymeshes = meshes
         ship = meshes[0]
         ships.push(ship)
         
         for(let i=0; i<8; i++) {
             let other = new BABYLON.Mesh('other', scene)
             ship.getChildren().forEach(c=>{
                 c = c.createInstance('o')
                 c.parent = other
             })
             ships.push(other)
         }
    });

   
    
let cyl = BABYLON.MeshBuilder.CreateCylinder('a',{diameter:0.1, height:2}, scene)
cyl.isVisible = false
cyl.material = new BABYLON.StandardMaterial('a', scene)
cyl.material.diffuseColor.set(0.3,0.5,0.6)
cyl.material.specularColor.set(0.1,0.1,0.1)

let n = 50
let uff
const zero = new BABYLON.Vector3(0,0,0)
const xAxis = new BABYLON.Vector3(1,0,0)
const yAxis = new BABYLON.Vector3(0,1,0)
const zAxis = new BABYLON.Vector3(0,0,1)

for(let i=0;i<n;i++) {
  let a = cyl.createInstance('a'+i)
  let phi = Math.PI*2*i/n

  a.position.set(0,0,0)
  a.rotationQuaternion = new BABYLON.Quaternion()
  a.rotate(zAxis, 0.5*phi)
  a.translate(xAxis, 5, BABYLON.Space.WORLD)
  a.rotateAround(zero, yAxis, phi)
  
}
    
/*    
var toruses = [];
for(var i=0; i<m; i++) {
    var phi = 2*Math.PI*i/m;

    var torus = BABYLON.MeshBuilder.CreateTorus('t1', {diameter: 3, thickness: 0.1, tessellation: 64}, scene);            
    torus.material = cyanMat;
       
    
    torus.position.x = 0.5*Math.cos(phi);
    torus.position.y = 0.5*Math.sin(phi);
    
    
    toruses.push(torus);
}
*/

let axis
axis = BABYLON.MeshBuilder.CreateCylinder('x', {diameter:0.1, height:1}, scene)
axis.material = new BABYLON.StandardMaterial('a',scene)
axis.material.diffuseColor.set(1,0,0)

axis = BABYLON.MeshBuilder.CreateCylinder('y', {diameter:0.1, height:1}, scene)
axis.rotation.z = Math.PI/2
axis.material = new BABYLON.StandardMaterial('a',scene)
axis.material.diffuseColor.set(0,1,0)


function animate() {
    if(ship == null) return;
    
    let phi = performance.now() * 0.001
    
    for(let i = 0; i<ships.length; i++) {
        let ship = ships[i];
        let psi = phi + Math.PI*4*i/ships.length;
        ship.position.set(0,0,0)
        ship.rotationQuaternion = new BABYLON.Quaternion()
        
        ship.translate(yAxis, 1.1, BABYLON.Space.WORLD)
        ship.rotateAround(zero, zAxis, 0.5*psi + Math.PI/2)
        ship.translate(xAxis, 5, BABYLON.Space.WORLD)
        ship.rotateAround(zero, yAxis, psi)
    
    }
    
    
/*
    var theta = performance.now()*0.001;
    for(var i=0; i<m; i++) {
        var torus = toruses[i];
        var phi = 2*Math.PI*i/m;
        torus.rotationQuaternion = new BABYLON.Quaternion();
        
        // torus.rotate(BABYLON.Axis.Z, 0.05, BABYLON.Space.WORLD);
        torus.rotate(BABYLON.Axis.X, theta + phi , BABYLON.Space.WORLD);
        torus.rotate(BABYLON.Axis.Z, phi + Math.PI/2, BABYLON.Space.WORLD);
        
    
    }
    */
}

        
engine.runRenderLoop(function(){
    animate();
    scene.render();
});
        
// https://github.com/gianmarco-todesco/conferenza-righi
// gianmarco.todesco@gmail.com