"use client"

import React, { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import * as THREE from "three"
import { OrbitControls } from "three-stdlib/controls/OrbitControls"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"

import DownloadSharePanel from "./DownloadSharePanel"
// import IngredientSelectionPanel from "./IngredientSelectionPanel"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

const BurgerCustomizationArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [objects, setObjects] = useState<THREE.Object3D[]>([])
  const [buns, setBuns] = useState<THREE.Object3D | null>(null)
  // const [echoDB, setEchoDB] = useState<any>(null)
  const [loadedIngredients, setLoadedIngredients] = useState(false)
  const [ingredientObjects, setIngredientObjects] = useState<
    IngredientObject[]
  >([
    {
      name: "buns",
      entryID: "2cc37c32-a2cf-47af-b4c9-668e8ef16ea3",
      storageID: "5989ab4a-e2c4-403d-a031-3f44185188fa.glb",
    },
    {
      name: "lettuce",
      entryID: "82361576-6ac4-45c8-9a25-9bca0867ab13",
      storageID: "2aca97a3-536a-4c9b-bd22-8617cf8bef68.glb",
    },
    {
      name: "tomato",
      entryID: "7858a907-64aa-4397-95ff-e24bdebdbcbe",
      storageID: "f1ae914b-612b-404c-b563-1616dbf364a3.glb",
    },
    {
      name: "cheese",
      entryID: "b42018c2-61ef-4bed-b622-60e15bb2f356",
      storageID: "e4bce58d-bfdd-40f0-870f-8471810072cd.glb",
    },
    {
      name: "patty",
      entryID: "3fbb6d3e-2621-403e-a391-d9c5ae918015",
      storageID: "0e44319e-1f02-421e-9733-f64da1819401.glb",
    },
  ])


  const fetchIngredientsData = async () => {
    try {
      const link = "https://storage.echo3d.com/shrill-dew-9515/"
      const updatedIngredientObjects = await Promise.all(
        ingredientObjects.map(async (ingredient) => {
          const response = await fetch(link + ingredient.storageID)
          const ingredientGLB = await response.blob()
          if (ingredientGLB) {
            return { ...ingredient, blob: ingredientGLB }
          } else {
            console.error("Error fetching ingredient data: blob is null")
            return { ...ingredient, blob: null }
          }
        })
      )
      setIngredientObjects(updatedIngredientObjects)
      setLoadedIngredients(true)
    } catch (error) {
      console.error("Error fetching ingredients data:", error)
    }
  }

  useEffect(() => {
    // fetchEcho3DData()
    console.log(ingredientObjects)
    fetchIngredientsData()
  }, [])

  const handleObjectToggle = async (ingredientName: string) => {
    if (!loadedIngredients) {
      toast.error("Ingredients data not loaded.")
      return
    }

    if (scene) {
      const ingredient = ingredientObjects.find(
        (i) => i.name === ingredientName
      )

      console.log("Ingredient added: ", ingredient)

      if (!ingredient || !ingredient.blob) {
        toast.error("Ingredient data not loaded.")
        return
      }

      const objectURL = URL.createObjectURL(ingredient.blob)
      const existingObject = scene.children.find(
        (object) => object.userData.name === ingredientName
      )

      if (existingObject instanceof THREE.Object3D) {
        scene.remove(existingObject)
      } else {
        const loader = new GLTFLoader()
        try {
          const gltf = await loader.loadAsync(objectURL)
          gltf.scene.userData.name = ingredientName
          gltf.scene.rotation.x = -Math.PI / 2
          scene.add(gltf.scene)
        } catch (error) {
          console.error("Error loading object:", error)
          toast.error("Failed to load object.")
        }
      }
    } else {
      toast.error("Scene not loaded.")
    }
  }


  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const scene = new THREE.Scene()
    setScene(scene)
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(
      containerRef.current.offsetWidth * 1000,
      containerRef.current.offsetHeight * 1000
    )

    camera.position.z = 15
    camera.position.y = 4
    camera.position.x = 0

    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true
    // controls.dampingFactor = 0.05
    // controls.screenSpacePanning = false
    // controls.minDistance = 20
    // controls.maxDistance = 100
    // // controls.maxPolarAngle = Math.PI / 2

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

    const animate = () => {
      requestAnimationFrame(animate)
      //   controls.update()
      scene.rotation.y += 0.002
      renderer.render(scene, camera)
    }

    const onWindowResize = () => {
      updateSize()
    }

    window.addEventListener("resize", onWindowResize)

    animate()

    const currentContainerRef = containerRef.current

    const light = new THREE.PointLight(0xffffff, 0.5, 100)
    light.position.set(10, 10, 20)
    scene.add(light)

    const light2 = new THREE.PointLight(0xffffff, 0.5, 100)
    light2.position.set(-10, -10, -20)
    scene.add(light2)

    scene.add(new THREE.AmbientLight(0xfff0e3, 0.9))

    return () => {
      renderer.dispose()
      currentContainerRef?.removeChild(renderer.domElement)
      window.removeEventListener("resize", onWindowResize)
    }
  }, [containerRef])

  // LOAD BUNS

  useEffect(() => {
    if (scene) {
      const loader = new GLTFLoader()

      loader.load(
        "/buns.glb",
        (gltf) => {
          const object = gltf.scene
          object.rotation.x = -Math.PI / 2
          setBuns(object)
          scene.add(object)
        },
        undefined,
        (error) => {
          console.error("An error occurred while loading the object:", error)
          toast.error("An error occurred while loading the object")
        }
      )
    }
  }, [scene])

  return (
    <>
      <ToastContainer />
      <div className="relative w-full">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 md:flex-row">
          <Card className="h-[500px] w-full md:max-w-[50%]">
            <CardHeader>
              <CardTitle>Burger Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={containerRef}
                id="local-burger-custom"
                className="h-[400px] w-full"
              ></div>
            </CardContent>
          </Card>

          <div className="w-full max-w-xs flex-col gap-6">
            <Card className="">
              <CardHeader>
                <CardTitle>Ingredient Selection</CardTitle>
                <CardDescription>
                  Click on the ingredients to add/remove them from the burger
                  stack!{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleObjectToggle("patty")}
                    variant="outline"
                    className="border-zinc-500 bg-yellow-900 text-white"
                  >
                    <Icons.patty />
                    Patty
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("tomato")}
                    variant="outline"
                    className="border-zinc-500 bg-red-500 text-white"
                  >
                    <Icons.tomato />
                    Tomato
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("lettuce")}
                    variant="outline"
                    className="border-zinc-500 bg-lime-600 text-white"
                  >
                    <Icons.lettuce />
                    Lettuce
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("cheese")}
                    variant="outline"
                    className="border-zinc-500 bg-yellow-500 text-white"
                  >
                    <Icons.cheese />
                    Cheese
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* <IngredientSelectionPanel onIngredientAdd={handleIngredientAdd} /> */}
            {/* <DownloadSharePanel /> */}
          </div>
        </div>
      </div>
      
    </>
  )
}

export default BurgerCustomizationArea
