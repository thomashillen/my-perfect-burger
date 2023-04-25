"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import IngredientSelectionPanel from './IngredientSelectionPanel';
import DownloadSharePanel from './DownloadSharePanel';

const BurgerCustomizationArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleIngredientAdd = (ingredient) => {
    console.log('Ingredient added:', ingredient);
    // Add the selected ingredient to the 3D scene
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.offsetWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    renderer.setSize(containerRef.current.offsetWidth, 400);
    containerRef.current.appendChild(renderer.domElement);

    // Replace the following example geometry and material with your burger 3D model(s)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;

    const onWindowResize = () => {
      if (!containerRef.current) {
        return;
      }
      camera.aspect = containerRef.current.offsetWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, 400);
    };

    window.addEventListener('resize', onWindowResize);

    const animate = () => {
      requestAnimationFrame(animate);

      // Update the 3D scene here, e.g., by adding or removing burger ingredients based on the burger's state

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col-reverse md:flex-row gap-6 w-full">
        <div ref={containerRef} id="burger-customization-area" className="w-full h-[400px]"></div>
        <div>
          <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} />
          <DownloadSharePanel />
        </div>
      </div>
    </div>
  );
};

export default BurgerCustomizationArea;
