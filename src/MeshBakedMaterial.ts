import * as THREE from 'three';

const before = `totalDiffuse + totalSpecular + totalEmissiveRadiance`;
const after = `sampledDiffuseColor.rgb + reflectedLight.indirectDiffuse + totalSpecular + totalEmissiveRadiance`

/** Drop-in replacement for MeshStandardMaterial that is useful for baked textures. */
export class MeshBakedMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters?: THREE.MeshStandardMaterialParameters) {
    super(parameters);    

    let userProvidedOnBeforeCompile = (shader : THREE.Shader) => {};

    // Replace the a line in the shader code with our own:
    const onBeforeCompile = (shader : THREE.Shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(before, after);
      userProvidedOnBeforeCompile(shader);
    };

    // Do some magic so that we can still call the user-provided onBeforeCompile function:
    Object.defineProperty(this, 'onBeforeCompile', {
      set: (handler : (shader : THREE.Shader) => any) => {
        userProvidedOnBeforeCompile = handler;
      },
      get : () => {
        return onBeforeCompile;
      }
    });
  }
}
