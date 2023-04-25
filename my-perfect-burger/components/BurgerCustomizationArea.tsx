"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

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

  const handleIngredientAdd = (ingredient) => {
    console.log("Ingredient added:", ingredient)
    // Add the selected ingredient to the 3D scene
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / 300,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setClearColor(0x000000, 0) // Set clear color to transparent
    renderer.setSize(containerRef.current.offsetWidth, 300)
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

    animate()

    return () => {
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Burger Builder</CardTitle>
 
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              id="burger-customization-area"
              className="w-full w-[300px]"
            ></div>
          </CardContent>

        </Card>
        <div>
          <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} />
          <DownloadSharePanel />
        </div>
      </div>
    </div>
  )
}

export default BurgerCustomizationArea
