import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
//import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

let container, scene, camera, renderer, card, controls, composer;

const params = {
    threshold: 2,
    strength: .15,
    radius: .7,
    exposure: 3
};

var CardFrontURL = 'CardFront3.jpg'; // Assign this from Product object
var CardBackURL = 'CardBack3.jpg'; // Assign this from Product object

var EnvPosXURL = 'StickerFront.gif'; // Environment Pos X URL
var EnvNegXURL = 'StickerFront.gif'; // Environment Neg X URL
var EnvPosYURL = 'StickerFront.gif'; // Environment Pos Y URL
var EnvNegYURL = 'StickerFront.gif'; // Environment Neg Y URL
var EnvPosZURL = 'StickerFront.gif'; // Environment Pos Z URL
var EnvNegZURL = 'StickerFront.gif'; // Environment Neg Z URL



function init(){
    container = document.getElementById("container");
   
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    controls.zoomSpeed = .5;
    controls.minPolarAngle = .15;
    controls.maxPolarAngle = 3.05;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.update();

    container.appendChild(renderer.domElement);
 

    // Create Environment texture
    /* var envmap = new THREE.CubeTextureLoader().load([
        EnvPosXURL, EnvNegXURL,
        EnvPosYURL, EnvNegYURL,
        EnvPosZURL, EnvNegZURL
      ], function () { console.log("envmap loaded"); }); */

      var envmap = new RGBELoader().load( 'je_gray_02_4k_Blur.hdr', function ( texture ) {

        texture.mapping = THREE.EquirectangularReflectionMapping;

        texture.needsUpdate = true;

    } );
    
    //create shape
    const geometry = new THREE.BoxGeometry(1, 1.408, 0.050);
    
    /* -- Original Texture Creation from Images --
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
    -- End of Original Texture Creation from Images */

    // Get Video Objects and start videos
    const videoFrontBase = document.getElementById( 'videoFront-base' );
    videoFrontBase.play();

    const videoFrontRoughness = document.getElementById( 'videoFront-roughness' );
    videoFrontRoughness.play();

    const videoFrontMetallic = document.getElementById( 'videoFront-metallic' );
    videoFrontMetallic.play();

    const videoFrontEmissive = document.getElementById( 'videoFront-emissive' );
    videoFrontEmissive.play();

    const videoBackBase = document.getElementById( 'videoBack-base' );
    videoBackBase.play();

    const videoBackRoughness = document.getElementById( 'videoBack-roughness' );
    videoBackRoughness.play();

    const videoBackMetallic = document.getElementById( 'videoBack-metallic' );
    videoBackMetallic.play();

    const videoBackEmissive = document.getElementById( 'videoBack-emissive' );
    videoBackEmissive.play();

    // New Texture Creation from Video
    const textureFront = new THREE.VideoTexture( videoFrontBase );
    textureFront.colorSpace = THREE.SRGBColorSpace;

    const textureFrontRoughness = new THREE.VideoTexture( videoFrontRoughness );
    textureFrontRoughness.colorSpace = THREE.SRGBColorSpace;

    const textureFrontMetallic = new THREE.VideoTexture( videoFrontMetallic );
    textureFrontMetallic.colorSpace = THREE.SRGBColorSpace;

    const textureFrontEmissive = new THREE.VideoTexture( videoFrontEmissive );
    textureFrontEmissive.colorSpace = THREE.SRGBColorSpace;

    const textureBack = new THREE.VideoTexture( videoBackBase );
    textureBack.colorSpace = THREE.SRGBColorSpace;

    const textureBackRoughness = new THREE.VideoTexture( videoBackRoughness );
    textureBackRoughness.colorSpace = THREE.SRGBColorSpace;

    const textureBackMetallic = new THREE.VideoTexture( videoBackMetallic );
    textureBackMetallic.colorSpace = THREE.SRGBColorSpace;

    const textureBackEmissive = new THREE.VideoTexture( videoBackEmissive );
    textureBackEmissive.colorSpace = THREE.SRGBColorSpace;

    const cardMaterials = [
        new THREE.MeshPhysicalMaterial({ 
            color: 0xc48731, 
            envMap: envmap, 
            envMapIntensity: 10,
            reflectivity: 1,
            metalness : 1, 
            roughness : 0
        }), //LeftSide
        new THREE.MeshPhysicalMaterial({ 
            color: 0xc48731, 
            envMap: envmap, 
            envMapIntensity: 10,
            reflectivity: 1,
            metalness : 1, 
            roughness : 0
        }), //RightSide
        new THREE.MeshPhysicalMaterial({ 
            color: 0xc48731, 
            envMap: envmap, 
            envMapIntensity: 10,
            reflectivity: 1,
            metalness : 1, 
            roughness : 0
        }), //Top
        new THREE.MeshPhysicalMaterial({ 
            color: 0xc48731, 
            envMap: envmap, 
            envMapIntensity: 10,
            reflectivity: 1,
            metalness : 1, 
            roughness : 0
        }), //Bottom
        new THREE.MeshStandardMaterial({ 
            map: textureFront, 
            envMap: envmap, 
            envMapIntensity: .2,
            metalness : 0, 
            //metalnessMap : textureFrontMetallic,
            roughness : 0.75,
            //roughnessMap : textureFrontRoughness,
            emissive : 0x7b03fc,
            emissiveIntensity: 5,
            emissiveMap : textureFrontEmissive
        }), //Front
        new THREE.MeshStandardMaterial({ 
            map: textureBack, 
            envMap: envmap, 
            envMapIntensity: .2,
            metalness : 0, 
            //metalnessMap : textureBackMetallic,
            roughness : 0.75,
            //roughnessMap : textureBackRoughness,
            emissive : 0x7b03fc,
            emissiveIntensity: 5,
            emissiveMap : textureBackEmissive
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

    renderer.autoClear = false;

    // postprocessing
    
        const renderPass = new RenderPass( scene, camera );
        //const bloomPass = new BloomPass( 0.5 );
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;

        const outputPass = new ShaderPass( GammaCorrectionShader );
    
         composer = new EffectComposer( renderer );
    
        composer.addPass( renderPass );
        //composer.addPass( bloomPass );
        composer.addPass( bloomPass );
        composer.addPass( outputPass );
    
    //
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

    //renderer.render(scene, camera);
    composer.render();

    
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