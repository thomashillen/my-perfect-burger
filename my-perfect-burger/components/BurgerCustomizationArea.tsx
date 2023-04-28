"use client"

import React, { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import * as THREE from "three"
import { OrbitControls } from "three-stdlib/controls/OrbitControls"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"

import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

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
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [echoDB, setEchoDB] = useState<any[]>([])

  // Fetch echo3D data
  const fetchEcho3DData = async () => {
    try {
      const apiKey = "shrill-dew-9515"
      const response = await axios.get(
        "https://api.echo3D.com/query?key=" + apiKey
      )
      const json = response.data
      setEchoDB(json)
      const EchoDB = json
      console.log(json)
      // console.log(typeof echoDB);
    } catch (error) {
      console.error("Error fetching echo3D data:", error)
    }
  }

  useEffect(() => {
    fetchEcho3DData()
    if (containerRef.current) {
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      console.log("width: " + width)
      console.log("height: " + height)
      // Set up Three.js scene
      const scene = new THREE.Scene()
      setScene(scene)
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.offsetWidth / containerRef.current.offsetHeight,
        0.1,
        1000
      )
      const renderer = new THREE.WebGLRenderer({ alpha: true })
      const controls = new OrbitControls(camera, renderer.domElement)
    }
  }, [])

  const handleIngredientAdd = async (entryID: string) => {
    if (scene) {
      await loadObjectFromEntryID(scene, entryID)
      toast.success("Ingredient added!")
    } else {
      toast.error("Scene not ready.")
    }
  }

  const loadObjectFromEntryID = async (scene: THREE.Scene, entryID: string) => {
    const loader = new GLTFLoader()


    const objectData = echoDB["db"].find((item) => item.id === entryID)
    if (objectData) {
      const glbURL = objectData.glb_url

      loader.load(
        glbURL,
        (gltf) => {
          scene.add(gltf.scene)
        },
        undefined,
        (error) => {
          console.error("An error occurred while loading the object:", error)
          toast.error("An error occurred while loading the object")
        }
      )
    } else {
      console.error("Object not found in echoDB")
      toast.error("Object not found in echoDB")
    }
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const scene = new THREE.Scene()
    setScene(scene)
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 10
    controls.maxDistance = 100
    controls.maxPolarAngle = Math.PI / 2

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

    renderer.setClearColor(0x000000, 0)
    updateSize()
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 0

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    const onWindowResize = () => {
      updateSize()
    }

    window.addEventListener("resize", onWindowResize)

    animate()

    const currentContainerRef = containerRef.current

    return () => {
      renderer.dispose()
      currentContainerRef?.removeChild(renderer.domElement)
      window.removeEventListener("resize", onWindowResize)
    }
  }, [containerRef])

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-6 md:flex-row">
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
        <div className="flex max-w-xs flex-col gap-4">
          {/* <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} /> */}
          {/* <DownloadSharePanel /> */}
        </div>
      </div>
    </>
  )
}

export default BurgerCustomizationArea
