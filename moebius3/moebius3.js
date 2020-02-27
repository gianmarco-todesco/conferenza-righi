// Gian Marco Todesco
// https://github.com/gianmarco-todesco/conferenza-righi

// solite cose (canvas, engine, scene, ecc.)
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

// window.addEventListener("resize", () => engine.resize())

 
let ships = []
let ship = null

// carico il modello
// (il modello è stato scaricato da https://clara.io/library)
let modelName = "star-wars-vader-tie-fighter.babylon"
BABYLON.SceneLoader.ImportMesh("", "./", modelName, scene, function (meshes) {          
    // questa funzione viene eseguita quando il caricamento
    // è andato a buon fine
    ship = meshes[0]
    ships.push(ship)
    
    // costruisco un certo numero di repliche dell'astronave
    for(let i=0; i<8; i++) {
        // creo una nuova mesh vuota
        let other = new BABYLON.Mesh('other', scene)
        // e per ogni mesh "figlia" di ship creo
        // una copia e ne faccio un nuovo "figlio" di other
        ship.getChildren().forEach(c=>{
            let inst = c.createInstance('o')
            inst.parent = other
        })
        // aggiungo la nuova mesh alla lista delle astronavi
        ships.push(other)
    }
});

// creo il moebius. Comincio con un cilindro
let cyl = BABYLON.MeshBuilder.CreateCylinder('a',
    {diameter:0.2, height:4}, 
    scene)
cyl.isVisible = false
cyl.material = new BABYLON.StandardMaterial('a', scene)
cyl.material.diffuseColor.set(0.3,0.5,0.6)
cyl.material.specularColor.set(0.1,0.1,0.1)

// creo un certo numero di repliche
let n = 70
const zero = new BABYLON.Vector3(0,0,0)
const xAxis = new BABYLON.Vector3(1,0,0)
const yAxis = new BABYLON.Vector3(0,1,0)
const zAxis = new BABYLON.Vector3(0,0,1)

for(let i=0;i<n;i++) {
  let a = cyl.createInstance('a'+i)

  // le repliche sono equispaziate su un angolo di 2PI
  let phi = Math.PI*2*i/n

  // ruoto attorno all'asse z 
  a.rotate(zAxis, 0.5*phi)
  // sposto lungo l'asse x
  a.translate(xAxis, 5, BABYLON.Space.WORLD)
  // e ruoto attorno all'asse verticale
  a.rotateAround(zero, yAxis, phi)  
}


function animate() {
    // il caricamento del modello può richiedere un po' di tempo
    // quindi dobbiamo controllare che il caricamento sia già terminato.
    if(ship == null) return;
    
    // l'angolo phi cresce con il tempo
    let phi = performance.now() * 0.001
    
    // posiziono tutte le atronavi
    for(let i = 0; i<ships.length; i++) {
        // l'astronave i-esima
        let ship = ships[i];
        // si trova posizionata ad un angolo psi
        // che dipende sia dal tempo, sia dalla posizione
        // dell'astronave nella lista
        let psi = phi + Math.PI*4*i/ships.length;

        // riporto l'astronave nella posizione di partenza
        // (nel fotogramma precedente si era spostata)
        ship.position.set(0,0,0)
        ship.rotationQuaternion = new BABYLON.Quaternion()
        
        // la sposto verso l'alto (voglio che galleggi sul moebius)
        ship.translate(yAxis, 1.1, BABYLON.Space.WORLD)
        // rotazione attorno a z
        ship.rotateAround(zero, zAxis, 0.5*psi + Math.PI/2)
        // spostamento in direzione x
        ship.translate(xAxis, 5, BABYLON.Space.WORLD)
        // rotazione attorno all'asse verticale
        ship.rotateAround(zero, yAxis, psi)
    }
}

        
engine.runRenderLoop(function(){
    animate();
    scene.render();
});
