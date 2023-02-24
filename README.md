# MeshBakedMaterial

A material for ThreeJS that allows you to combine the baked lighting from a MeshBasicMaterial, with the specular highlights of MeshStandardMaterial.

## About

The classic approach to using a baked texture in [Three.js](https://threejs.org/) is as a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial). This material is used because it will not interact with any lighting in your scene - we want it to be rendered without realtime lighting, since the lighting has been baked into the texture already. However, if you're trying to bake a material that is shiny or metallic, you'll find that your textures look very flat in ThreeJS, since MeshBasicMaterial cannot render materials that interact with lights. For some materials this can really change how it looks:

<table style="margin: auto">
  <tr>
    <td>
      <img src="https://user-images.githubusercontent.com/5386710/221252121-36c18cc1-f136-4835-ab9b-472b412f7a5c.png" width=400><br>
      <center>How it looks in Blender</center>
    </td>
    <td>
      <img src="https://user-images.githubusercontent.com/5386710/221253771-d8efd70c-e2e3-4b59-9110-24b05345e378.jpg" width=400><br>
      <center>How it looks (baked) in Three.js</center>
    </td>
  </tr>
</table>


MeshBakedMaterial will enable you to have specular reflections on your baked textures, without double-dipping on your lighting. With this approach you can continue to use roughness/metalness values or maps, and get dramatic results, while still saving on performance by baking nice shadows.

## How to use

Install with npm via `npm install mesh-baked-material`.

Use in your project like so:

```
import MeshBakedMaterial from 'mesh-baked-material';

const mat = new MeshBakedMaterial({map: bakedMap, roughness: 0.1, metalness: 0.3});
```

Shout out to Bruno Simon and his [ThreeJS Journey](https://threejs-journey.com/) class, without which I'd be completely lost.
