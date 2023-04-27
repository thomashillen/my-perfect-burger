"use client"
import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"
import { OrbitControls } from "three-stdlib/controls/OrbitControls"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import DownloadSharePanel from "./DownloadSharePanel"
import IngredientSelectionPanel from "./IngredientSelectionPanel"


const BurgerCustomizationArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [glbObjects, setGlbObjects] = useState<{ url: string } | null>(null);

  const handleIngredientAdd = (ingredient) => {
    console.log("Ingredient added:", ingredient)
    // Add the selected ingredient to the 3D scene

    toast.success("Ingredient added!")
  }

  const fetchGlbObject = async (entryID) => {
    try {
      const response = await axios.get(`/api/fetchGlbObjects?entryID=${entryID}`);
      const glbObject = response.data;

      setGlbObjects(glbObject);
      console.log("GLB object:", glbObject);
    } catch (error) {
      console.error("Error fetching GLB object:", error);
    }
  };

  useEffect(() => {
    // Replace "de8f1550-78f0-451a-b80a-1a745f472741" with the entry-ID you want to fetch
    fetchGlbObject("de8f1550-78f0-451a-b80a-1a745f472741");
  }, []);

  useEffect(() => {
    if (!containerRef.current || !glbObjects) {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    // Add OrbitControls for better user experience
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2;

    // Load the fetched GLB object
    const loader = new GLTFLoader();
    if (glbObjects && glbObjects.url) {
      loader.load(glbObjects.url, (gltf) => {
        const mesh = gltf.scene;
        scene.add(mesh);
      });
    }

    const updateSize = () => {
      if (!containerRef.current) {
        return;
      }

      renderer.setSize(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      );
      camera.aspect =
        containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
    };

    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    updateSize();
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 50;

    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      updateSize();
    };

    window.addEventListener("resize", onWindowResize);

    animate();

    const currentContainerRef = containerRef.current;

    return () => {
      renderer.dispose();
      currentContainerRef?.removeChild(renderer.domElement);
      window.removeEventListener("resize", onWindowResize);
    };
  }, [glbObjects]);

  return (
    <>

    <ToastContainer/>
    <div className="flex flex-col gap-6 md:flex-row  ">
      <Card>
        <CardHeader>
          <CardTitle>Burger Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            id="burger-customization-area"
            className="h-[300px] min-w-[200px] max-w-[250px] md:max-w-[500px]"
          ></div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 max-w-xs">
        <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} />
        <DownloadSharePanel />
      </div>
    </div>

    </>
  )
}

export default BurgerCustomizationArea
