import * as THREE from "https://unpkg.com/three@0.120.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls";

let container, scene, camera, renderer, card, controls;

var CardFrontURL = 'CardFront3.jpg'; // Assign this from Product object
var CardBackURL = 'CardBack3.jpg'; // Assign this from Product object

var EnvPosXURL = 'StickerFront.gif'; // Environment Pos X URL
var EnvNegXURL = 'StickerFront.gif'; // Environment Neg X URL
var EnvPosYURL = 'StickerFront.gif'; // Environment Pos Y URL
var EnvNegYURL = 'StickerFront.gif'; // Environment Neg Y URL
var EnvPosZURL = 'StickerFront.gif'; // Environment Pos Z URL
var EnvNegZURL = 'StickerFront.gif'; // Environment Neg Z URL

function init(){
    container = document.getElementById("world");
   
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    controls.zoomSpeed = .5;
    controls.minPolarAngle = .15;
    controls.maxPolarAngle = 3.05;
    controls.enablePan = false;
    controls.update();

    container.appendChild(renderer.domElement);
 

    // Create Environment texture
    var envmap = new THREE.CubeTextureLoader().load([
        EnvPosXURL, EnvNegXURL,
        EnvPosYURL, EnvNegYURL,
        EnvPosZURL, EnvNegZURL
      ], function () { console.log("envmap loaded"); });
    
    //create shape
    const geometry = new THREE.BoxGeometry(1, 1.408, 0.010);
    
    const texturefront = new THREE.TextureLoader().load( CardFrontURL );
        texturefront.wrapS = THREE.RepeatWrapping;
        texturefront.wrapT = THREE.RepeatWrapping;
        texturefront.repeat.set( 1, 1 );
        texturefront.center.set( 0.5, 0.5 );

    const textureback = new THREE.TextureLoader().load( CardBackURL );
         textureback.wrapS = THREE.RepeatWrapping;
          textureback.wrapT = THREE.RepeatWrapping;
          textureback.repeat.set( 1, 1 );
          textureback.center.set( 0.5, 0.5 );


    const cardMaterials = [
        new THREE.MeshStandardMaterial({ 
            color: 0xdedede, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0
        }), //LeftSide
        new THREE.MeshStandardMaterial({ 
            color: 0xdedede, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0
        }), //RightSide
        new THREE.MeshStandardMaterial({ 
            color: 0xdedede, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0
        }), //Top
        new THREE.MeshStandardMaterial({ 
            color: 0xdedede, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0
        }), //Bottom
        new THREE.MeshStandardMaterial({ 
            map: texturefront, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0 
        }), //Front
        new THREE.MeshStandardMaterial({ 
            map: textureback, 
            envMap: envmap, 
            envMapIntensity: 1,
            metalness : 1, 
            roughness : 0
        }), //Back
    ];

    //create material, color, or image texture
    card = new THREE.Mesh(geometry, cardMaterials);
    scene.add(card);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;

    //Light Source
    const pointLight = new THREE.PointLight( 0xffffff, 1.25, 100 );
    pointLight.position.set( 5, 5, 5 );
    scene.add( pointLight );

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );

    //Light Source2
    const pointLight2 = new THREE.PointLight( 0xffffff, 1.25, 100 );
    pointLight2.position.set( -5, 5, -5 );
    scene.add( pointLight2 );
    
    const sphereSize2 = 1;
    const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize2 );

    //Light Source Sky
    const light = new THREE.HemisphereLight( 0xffffff, 0x080820, .85 );
    scene.add( light );
}


//Camera Rotate Function
function checkRotation(){
    
    var rotSpeed = .001;

    var x = camera.position.x,
      y = camera.position.y,
      z = camera.position.z;
  

      camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

  
    camera.lookAt(scene.position);
  
  }

function animate(){
    requestAnimationFrame(animate);

    //Call Rotate Animation
    checkRotation();

    renderer.render(scene, camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();