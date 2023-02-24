# MeshBakedMaterial

A material for ThreeJS that allows you to combine the baked lighting from a MeshBasicMaterial, with the specular highlights of MeshStandardMaterial. Check out the [live example](https://mesh-baked-material-example.vercel.app/) to see what this does for you. For more info, scroll down to **About**.

<table align="center"><tr><td align="center">
  <img width="450" src="https://user-images.githubusercontent.com/5386710/221285482-4c243ad5-f80f-4749-9ff4-b4b38936eb86.png"><br>
  <b>Baked Texture with Physically Based Rendering</b>
</td></tr></table>


## How to use

Install with npm via `npm install mesh-baked-material`.

Use in your project like so:

```typescript
import MeshBakedMaterial from 'mesh-baked-material';

const mat = new MeshBakedMaterial({map: bakedMap, roughness: 0.1, metalness: 0.3});
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1), mat);
```

You can use all the same parameters as with MeshStandardMaterial, including `roughnessMap` and `metalnessMap`.

## About

### MeshBasicMaterial

The classic approach to using a baked texture in [Three.js](https://threejs.org/) is as a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial). This material is used because it will not interact with any lighting in your scene - we want it to be rendered without realtime lighting, since the lighting has been baked into the texture already. Here's how that looks in practice:

<table align="center">
  <tr>
    <td align="center">
      <img src="https://user-images.githubusercontent.com/5386710/221252121-36c18cc1-f136-4835-ab9b-472b412f7a5c.png" width=400><br>
      <b>How it looks in Blender</b>
    </td>
    <td align="center">
      <img src="https://user-images.githubusercontent.com/5386710/221260089-62a64233-b30f-42a4-aa17-c2728ccd18bf.png" width=220><br>
      <b>Baked Texture</b>
    </td>
    <td align="center">
      <img src="https://user-images.githubusercontent.com/5386710/221260496-8eb7330d-2772-4286-92d5-3e9adce304db.png" width=400><br>
      <b>How it looks in Three.js</b>
    </td>
  </tr>
</table>

However, if your scene as textures that should be a little glossy or metalic, you'll find that your textures look very flat in ThreeJS. This is because MeshBasicMaterial cannot render materials that interact with lights. In the above example, look how flat the floor texture looks -there's none of the specular/glossy reflections from the Blender scene.

### MeshStandardMaterial

You may attempt to fix this by using a [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) instead - which will interact with lights in your scene. This means we have to add lighting to the Three.js scene to try to match our renders. You can add an [AmbientLight](https://threejs.org/docs/?q=AmbientLight#api/en/lights/AmbientLight) to add some of the light back in, but in order to get the same reflections as in your render, you'll have to add the same lighting as in your bake. Here's an example of how this looks:

<table align="center"><tr><td align="center">
  <img  src="https://user-images.githubusercontent.com/5386710/221286400-6361e11a-4822-4610-9ca9-4342272b6214.png" width=450><br>
  <b>Three.js with MeshStandardMaterial</b>
</td></tr></table>

This doesn't look too bad at first glance - we have our glossy reflections, and some soft shadows in there. But on closer looks there's some issues that make it looks worse than our initial render. For example:
  - Lighting is way too saturated
  - the pillars are too bright and too dark
  - the shadows on the floor are washed out
  - the monkey is too contrasty
  
The reason why this result looks much worse is because now we're "*double-dipping*" on our lighting. We baked the textures with lights in them, and now they're in a scene with the same lights again. The brighter parts will become brighter, and the darker parts will become darker.

## MeshBakedMaterial

This is where our **MeshBakedMaterial** comes in. It's the same as MeshStandardMaterial, but will not addition diffuse lighting to an texture, only **specular** lighting. This means you can add roughness/metalness maps to a baked texture, without it being over or underlit from the scene lights. Take a look:

<table align="center"><tr><td align="center">
  <img width="450" src="https://user-images.githubusercontent.com/5386710/221285482-4c243ad5-f80f-4749-9ff4-b4b38936eb86.png"><br>
  <b>Final Result with MeshBakedMaterial</b>
</td></tr></table>

MeshBakedMaterial will enable you to have specular reflections on your baked textures, without double-dipping on your lighting. With this approach you can continue to use roughness/metalness values or maps, and get dramatic results, while still keeping those beautifully baked shadows.

### Shoutout!

Shout out to Bruno Simon and his [ThreeJS Journey](https://threejs-journey.com/) class, I highly recommend it!
