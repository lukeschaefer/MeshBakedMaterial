# MeshBakedMaterial

A material for ThreeJS that allows you to combine the baked lighting from a MeshBasicMaterial, with the specular highlights of MeshStandardMaterial. 
Check out the [live example](https://mesh-baked-material-example.vercel.app/) to see what this does for you. For more info, scroll down to **About**.


## How to use

Install with npm via `npm install mesh-baked-material`.

Use in your project like so:

```typescript
import MeshBakedMaterial from 'mesh-baked-material';

const mat = new MeshBakedMaterial({map: bakedMap, roughness: 0.1, metalness: 0.3});
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1), mat);
```

## About

The classic approach to using a baked texture in [Three.js](https://threejs.org/) is as a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial). This material is used because it will not interact with any lighting in your scene - we want it to be rendered without realtime lighting, since the lighting has been baked into the texture already. However, if you're trying to bake a material that is shiny or metallic, you'll find that your textures look very flat in ThreeJS, since MeshBasicMaterial cannot render materials that interact with lights. For some materials this can really change how it looks:

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

Note the lack of specular/glossy reflections in the Three.js result. You may attempt to fix this by using a [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) instead - however this will result in other problems. First, your object will render completely black unless you add in lights to your Three.js scene. You can add an [AmbientLight](https://threejs.org/docs/?q=AmbientLight#api/en/lights/AmbientLight) to match the flat look of a MeshBasicMaterial - but in order to get the same reflections as in your render, you'll have to add the same lighting as in your bake. However, when you do so, you'll now be "*double-dipping*" on your lighting. Areas that were in shadow or light in your bake, are doubly so in your Three.js scene:

<table align="center"><tr><td align="center">
  <img  src="https://user-images.githubusercontent.com/5386710/221267861-dff1e8ba-ac05-4548-84d3-735ff45b1fc4.png" width=450><br>
  <b>Three.js with MeshStandardMaterial</b>
</td></tr></table>

This doesn't look too bad at first glance - we have our reflections, and some soft shadows in there. But on closer looks there's some issues that make it looks worse than our initial render. For example:  
  - the pillars are too bright and too dark
  - the shadows on the floor are washed out
  - the monkey is too contrasty

In order to look as best as possible - we need to make sure we're not "*double-dipping*" on our lighting. This is where **MeshBakedMaterial** comes in. It's the same as MeshStandardMaterial, but will add addition diffuse lighting to an texture, only **specular** lighting. This means you can add roughness/metalness maps to a baked texture, without it being over or underlit from the scene lights. Take a look:


MeshBakedMaterial will enable you to have specular reflections on your baked textures, without double-dipping on your lighting. With this approach you can continue to use roughness/metalness values or maps, and get dramatic results, while still saving on performance by baking nice shadows.


Shout out to Bruno Simon and his [ThreeJS Journey](https://threejs-journey.com/) class, without which I'd be completely lost.