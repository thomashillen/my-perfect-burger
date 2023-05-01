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

  // Fetch echo3D data
  const fetchEcho3DData = async () => {
    try {
      const apiKey = "shrill-dew-9515"
      const response = await fetch(
        "https://api.echo3D.com/query?key=" + apiKey
      )
      const json = await response.json()
      // setEchoDB(json)
      const EchoDB = json
      console.log(json)
      // console.log(typeof echoDB);
    } catch (error) {
      console.error("Error fetching echo3D data:", error)
    }
  }

  useEffect(() => {
    fetchEcho3DData()
    
  }, [])

  const handleObjectToggle = async (objectURL: string) => {
    if (scene) {
      const existingObject = objects.find(
        (object) => object.userData.url === objectURL
      )
      if (existingObject) {
        scene.remove(existingObject)
        setObjects(objects.filter((object) => object !== existingObject))
        toast.success("Object removed!")
      } else {
        await loadObject(scene, objectURL)
        toast.success("Object added!")
      }
    } else {
      toast.error("Scene not ready.")
    }
  }

  const loadObject = async (scene: THREE.Scene, objectURL: string) => {
    const loader = new GLTFLoader()

    loader.load(
      objectURL,
      (gltf) => {
        const object = gltf.scene
        object.userData.url = objectURL
        object.rotation.x = -Math.PI / 2
        console.log(object)
        scene.add(object)
        setObjects([...objects, object])
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the object:", error)
        toast.error("An error occurred while loading the object")
      }
    )
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

  useEffect(() => {
    if (scene) {
      const loader = new GLTFLoader()

      loader.load(
        "/buns.glb",
        (gltf) => {
          const object = gltf.scene
          //   object.position.set(0, 0, 0)
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
          <Card className="h-[500px] md:max-w-[50%] w-full">
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

          <div className="w-full max-w-xs flex-col gap-4">
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
                    onClick={() => handleObjectToggle("/patty.glb")}
                    variant="outline"
                    className="border-zinc-500 bg-yellow-900 text-white"
                  >
                    <Icons.patty />
                    Patty
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("/tomato.glb")}
                    variant="outline"
                    className="border-zinc-500 bg-red-500 text-white"
                  >
                    <Icons.tomato />
                    Tomato
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("/lettuce.glb")}
                    variant="outline"
                    className="border-zinc-500 bg-lime-600 text-white"
                  >
                    <Icons.lettuce />
                    Lettuce
                  </Button>
                  <Button
                    onClick={() => handleObjectToggle("/cheese.glb")}
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
      <div className="absolute bottom-0 left-0 w-full text-center py-4 text-gray-500">
        Created by Thomas Hillenmeyer @ Echo3D
      </div>
    </>
  )
}

export default BurgerCustomizationArea
