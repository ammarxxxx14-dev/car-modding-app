import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const getFinishProps = (finishName) => {
  let m = 0.6, r = 0.2, i = 0.0;
  switch (finishName) {
    case 'pearlescent': m = 0.2; r = 0.1; break;
    case 'metallic': m = 0.9; r = 0.3; break;
    case 'semi-glossy': m = 0.3; r = 0.45; break;
    case 'matte': m = 0.1; r = 0.8; break;
    case 'chrome': m = 1.0; r = 0.0; break;
    case 'iridescent': m = 0.8; r = 0.15; i = 1.0; break;
    case 'glossy':
    default: m = 0.6; r = 0.2; break;
  }
  return { m, r, i };
};

function CarModel({ url, carColor, carColor2, splitPaint, paintFinish, paintFinish2, suspension }) {
  const { scene } = useGLTF(url, '/draco/gltf/');
  const bodyMaterials = useRef([]);
  const wheelNodes = useRef([]);
  const targetColor1 = useMemo(() => new THREE.Color(), []);
  const targetColor2 = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    bodyMaterials.current = [];
    wheelNodes.current = [];

    const bbox = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Cars are longer than they are wide.
    // The longest axis is the length of the car (front-to-back).
    // To split left vs right (a vertical split down the middle), we split along the shortest axis (width).
    const isXLongest = size.x > size.z;
    const splitAxis = isXLongest ? 'z' : 'x';
    const splitCenterVal = isXLongest ? center.z : center.x;

    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;

      const name = child.name.toLowerCase();
      if (
        name.includes('wheel') || name.includes('tire') ||
        name.includes('rim') || name.includes('alloy') || name.includes('disc')
      ) {
        wheelNodes.current.push({ node: child, initialY: child.position.y });
      }

      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat, i) => {
          if (!mat) return;
          const matName = (mat.name || '').toLowerCase();

          const isExcluded =
            matName.includes('glass') || matName.includes('cristal') ||
            matName.includes('goma') || matName.includes('tire') ||
            matName.includes('gomme') || matName.includes('interior') ||
            matName.includes('display') || matName.includes('mirror') ||
            matName.includes('light') || matName.includes('logo') ||
            matName.includes('asiento') || matName.includes('seat') ||
            matName.includes('pelle') || matName.includes('decal') ||
            matName.includes('cuciture') || matName.includes('plate') ||
            matName.includes('matricula') || matName.includes('wheel') ||
            matName.includes('rim') || matName.includes('brake') ||
            matName.includes('caliper');

          if (isExcluded) return;

          const isPaint =
            matName.includes('paint') || matName.includes('body') ||
            matName.includes('exterior') || matName.includes('color') ||
            matName.includes('caroserie') || matName.includes('shell') || 
            matName.includes('carroceria') || matName.includes('01_-_default') ||
            matName.includes('material');

          if (isPaint || (mat.metalness > 0.4 && mat.roughness < 0.6)) {
            const cloned = mat.clone();
            if (cloned.map) {
              cloned.map = null;
              cloned.needsUpdate = true;
            }
            
            cloned.metalness = 0.5;
            cloned.roughness = 0.5;

            const uniforms = {
              uSplitMode: { value: 0.0 },
              uColor1: { value: new THREE.Color('#ffffff') },
              uColor2: { value: new THREE.Color('#ff0000') },
              uMetalness1: { value: 0.6 },
              uMetalness2: { value: 0.6 },
              uRoughness1: { value: 0.2 },
              uRoughness2: { value: 0.2 },
              uIridescence1: { value: 0.0 },
              uIridescence2: { value: 0.0 },
              uSplitCenter: { value: splitCenterVal },
            };

            cloned.onBeforeCompile = (shader) => {
              shader.uniforms.uSplitMode = uniforms.uSplitMode;
              shader.uniforms.uColor1 = uniforms.uColor1;
              shader.uniforms.uColor2 = uniforms.uColor2;
              shader.uniforms.uMetalness1 = uniforms.uMetalness1;
              shader.uniforms.uMetalness2 = uniforms.uMetalness2;
              shader.uniforms.uRoughness1 = uniforms.uRoughness1;
              shader.uniforms.uRoughness2 = uniforms.uRoughness2;
              shader.uniforms.uIridescence1 = uniforms.uIridescence1;
              shader.uniforms.uIridescence2 = uniforms.uIridescence2;
              shader.uniforms.uSplitCenter = uniforms.uSplitCenter;

              shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>
                varying vec3 vWorldPos;
                varying vec3 vViewDir;
                varying vec3 vCustomNormal;`
              );
              shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `#include <worldpos_vertex>
                vWorldPos = worldPosition.xyz;
                vViewDir = normalize(cameraPosition - worldPosition.xyz);
                vCustomNormal = normalize(transformedNormal);`
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                uniform float uSplitMode;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uMetalness1;
                uniform float uMetalness2;
                uniform float uRoughness1;
                uniform float uRoughness2;
                uniform float uIridescence1;
                uniform float uIridescence2;
                uniform float uSplitCenter;
                varying vec3 vWorldPos;
                varying vec3 vViewDir;
                varying vec3 vCustomNormal;`
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                float customBlend = smoothstep(uSplitCenter - 0.05, uSplitCenter + 0.05, vWorldPos.${splitAxis});
                vec3 baseC = uColor1;
                float curIridescence = uIridescence1;
                if (uSplitMode > 0.5) {
                  baseC = mix(uColor2, uColor1, customBlend);
                  curIridescence = mix(uIridescence2, uIridescence1, customBlend);
                }
                
                float viewDot = max(0.0, dot(vCustomNormal, vViewDir));
                vec3 iriColor = mix(vec3(1.0, 0.2, 0.8), vec3(0.2, 1.0, 0.5), viewDot);
                
                diffuseColor.rgb = mix(baseC, baseC * iriColor * 2.0, curIridescence);`
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <roughnessmap_fragment>',
                `#include <roughnessmap_fragment>
                if (uSplitMode > 0.5) {
                  roughnessFactor = mix(uRoughness2, uRoughness1, customBlend);
                } else {
                  roughnessFactor = uRoughness1;
                }`
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <metalnessmap_fragment>',
                `#include <metalnessmap_fragment>
                if (uSplitMode > 0.5) {
                  metalnessFactor = mix(uMetalness2, uMetalness1, customBlend);
                } else {
                  metalnessFactor = uMetalness1;
                }`
              );
            };
            cloned.customProgramCacheKey = () => 'splitPaintShader_' + splitAxis;
            cloned.needsUpdate = true;

            if (Array.isArray(child.material)) child.material[i] = cloned;
            else child.material = cloned;
            bodyMaterials.current.push({ mat: cloned, uniforms });
          }
        });
      }
    });
  }, [scene, url]);

  useFrame(() => {
    if (bodyMaterials.current.length === 0) return;
    targetColor1.set(carColor);
    targetColor2.set(carColor2 || carColor);

    const f1 = getFinishProps(paintFinish);
    const f2 = getFinishProps(paintFinish2 || paintFinish);

    bodyMaterials.current.forEach(({ mat, uniforms }) => {
      uniforms.uSplitMode.value = splitPaint ? 1.0 : 0.0;
      uniforms.uColor1.value.lerp(targetColor1, 0.05);
      uniforms.uColor2.value.lerp(targetColor2, 0.05);
      
      uniforms.uMetalness1.value += (f1.m - uniforms.uMetalness1.value) * 0.1;
      uniforms.uRoughness1.value += (f1.r - uniforms.uRoughness1.value) * 0.1;
      uniforms.uIridescence1.value += (f1.i - uniforms.uIridescence1.value) * 0.1;

      uniforms.uMetalness2.value += (f2.m - uniforms.uMetalness2.value) * 0.1;
      uniforms.uRoughness2.value += (f2.r - uniforms.uRoughness2.value) * 0.1;
      uniforms.uIridescence2.value += (f2.i - uniforms.uIridescence2.value) * 0.1;

      mat.color.lerp(targetColor1, 0.05);
    });
  });

  useEffect(() => {
    const maxDrop = 0.15;
    const drop = suspension * maxDrop;
    scene.position.y = -drop;
    wheelNodes.current.forEach(({ node, initialY }) => {
      node.position.y = initialY + drop;
    });
  }, [suspension, scene]);

  return <primitive object={scene} />;
}

export default function CanvasArea({ currentModel, carColor, carColor2, splitPaint, paintFinish, paintFinish2, suspension, carScale, carPosition }) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        key={currentModel}
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [5, 2, 8], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <color attach="background" args={['#0d0d0d']} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} />
        <hemisphereLight skyColor="#aaaaff" groundColor="#444400" intensity={0.3} />

        <Environment preset="warehouse" background={false} />

        <Suspense fallback={null}>
            <group scale={carScale} position={carPosition}>
              <CarModel url={currentModel} carColor={carColor} carColor2={carColor2} splitPaint={splitPaint} paintFinish={paintFinish} paintFinish2={paintFinish2} suspension={suspension} />
            </group>
        </Suspense>

        <OrbitControls
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
