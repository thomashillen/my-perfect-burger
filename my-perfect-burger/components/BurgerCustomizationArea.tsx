"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import DownloadSharePanel from "./DownloadSharePanel"
import IngredientSelectionPanel from "./IngredientSelectionPanel"

const BurgerCustomizationArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleIngredientAdd = (ingredient) => {
    console.log("Ingredient added:", ingredient)
    // Add the selected ingredient to the 3D scene

    alert("ingredient added!")
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    // Fetch GLB objects from echo3D
    fetch("/api/fetchGlbObjects")
      .then((response) => response.json())
      .then((data) => {
        console.log("GLB objects fetched from echo3D:", data)

        // Add your logic here to process the fetched GLB objects
      })
      .catch((error) => {
        console.error("Error fetching GLB objects from echo3D:", error)
      })

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    const updateSize = () => {
      if (!containerRef.current) {
        return
      }

      renderer.setSize(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      )
      camera.aspect =
        containerRef.current.offsetWidth / containerRef.current.offsetHeight
      camera.updateProjectionMatrix()
    }

    renderer.setClearColor(0x000000, 0) // Set clear color to transparent
    updateSize()
    containerRef.current.appendChild(renderer.domElement)

    // Replace the following example geometry and material with your burger 3D model(s)
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)

    scene.add(cube)
    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)

      // Update the 3D scene here, e.g., by adding or removing burger ingredients based on the burger's state

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    const onWindowResize = () => {
      updateSize()
    }

    window.addEventListener("resize", onWindowResize)

    animate()

    // Copy the containerRef.current value to a variable inside the effect
    const currentContainerRef = containerRef.current

    return () => {
      renderer.dispose()
      // Use the variable in the cleanup function
      currentContainerRef?.removeChild(renderer.domElement)
      window.removeEventListener("resize", onWindowResize)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Card>
        <CardHeader>
          <CardTitle>Burger Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            id="burger-customization-area"
            className="h-[300px] w-full min-w-[200px] max-w-[250px] md:max-w-[500px]"
          ></div>
        </CardContent>
      </Card>
      <div>
        <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} />
        <DownloadSharePanel />
      </div>
    </div>
  )
}

export default BurgerCustomizationArea
