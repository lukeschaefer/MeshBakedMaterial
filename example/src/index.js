import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import { TransformControls } from 'three/addons/controls/TransformControls.js';


const before = `totalDiffuse + totalSpecular + totalEmissiveRadiance`;
const after = `sampledDiffuseColor.rgb + reflectedLight.indirectDiffuse + totalSpecular + totalEmissiveRadiance`

/** Drop-in replacement for MeshStandardMaterial that is useful for baked textures. */
export class MeshBakedMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters) {
    super(parameters);    

    // Replace the a line in the shader code with our own:
    this.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(before, after);
    };
  }
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 20
scene.add(camera)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const glbLoader = new GLTFLoader();

glbLoader.load("monkey_bake.glb", (gltf) => {
  // Add lights to match the baked lights:
  const lights = [];
  [-10,0,10].forEach(z => {
    const pinkLight = new THREE.PointLight(0xFF00FF, .5);
    pinkLight.position.set(-7.6, 9.6, z-0.3);

    const cyanLight = new THREE.PointLight(0x00FFFF, .5);
    cyanLight.position.set(7.6, 9.6, z-0.3);

    lights.push(pinkLight, cyanLight);

    scene.add(pinkLight);
    scene.add(cyanLight);
  });
  // const tc = new TransformControls(camera, canvas)

  // tc.addEventListener('dragging-changed', (event) => {
  //   controls.enabled = !event.value;
  // });
  // tc.addEventListener('mouseUp', (event) => {
  //   console.log(tc.object.position)
  // });
  //   scene.add(tc)
  // tc.attach(light);
  const bakedTexture = textureLoader.load('map.jpg');
  bakedTexture.flipY = false;

  const roughnessMap = textureLoader.load("roughness.jpg");

  const lampMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

  // Traditional way of baking textures:
  const basicMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    map: bakedTexture
  })

  // With our new MeshBakedMaterial:
  const standardMat = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    map: bakedTexture,
    roughnessMap
  })

  // With our new MeshBakedMaterial:
  const bakedMat = new MeshBakedMaterial({
    color: 0xCCCCCC,
    map: bakedTexture,
    roughnessMap
  })

  const updateSceneWithMaterial = (material) => {
    gltf.scene.traverse(obj => {
      if(obj instanceof THREE.Mesh) {
        // Lamps should always just be pure white:
        obj.material = obj.name.startsWith("Icosphere") ? lampMat : material;
      }
    })
  };

  scene.add(gltf.scene);


  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0);
  scene.add(ambientLight);

  const sceneUpdater = {
    "MeshBasicMaterial": () => updateSceneWithMaterial(basicMat),
    "MeshStandardMaterial": () => {
      // Tweak the lights to look as close as possible to the baked lights:
      ambientLight.intensity = .4;
      lights.forEach(light => light.intensity = .6);
      updateSceneWithMaterial(standardMat)
    },
    "MeshBakedMaterial": () => {
      // Unlike MeshStandardMaterial, MeshBakedMaterial doesn't need ambientLight
      // to look correct - but we can crank up point light brightness to get lots 
      // of specular highlights:
      ambientLight.intensity = 0;
      lights.forEach(light => light.intensity = 1.4);
      updateSceneWithMaterial(standardMat)
      updateSceneWithMaterial(bakedMat)
    }
  }

  sceneUpdater.MeshBakedMaterial();

  gui.add(sceneUpdater, "MeshBasicMaterial");
  gui.add(sceneUpdater, "MeshStandardMaterial");
  gui.add(sceneUpdater, "MeshBakedMaterial");
});

  

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()