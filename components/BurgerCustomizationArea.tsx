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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"

const BurgerCustomizationArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [objects, setObjects] = useState<THREE.Object3D[]>([])
  const [buns, setBuns] = useState<THREE.Object3D | null>(null)
  // const [echoDB, setEchoDB] = useState<any>(null)
  const [loadedIngredients, setLoadedIngredients] = useState(false)
  const [cheeseOptions, setCheeseOptions] = useState<any[]>([])
  const [meatOptions, setMeatOptions] = useState<any[]>([])

  //Defining the properties of each item in the Ingredients list
  type IngredientObject = {
    name: string
    entryID: string
    storageID: string
    ingredientType: string
    blob?: Blob | null
  }

  //This is the list that holds all the ingredient objects
  const [ingredientObjects, setIngredientObjects] = useState<
    IngredientObject[]
  >([])

  const fetchEcho3dData = async () => {
    try {
      const apiKey = "shrill-dew-9515" //replace with your api key
      const response = await fetch("https://api.echo3D.com/query?key=" + apiKey)
      const json = await response.json()
      // console.log(json)

      const entriesArray = Object.values(json.db)

      const burgerIngredients = entriesArray
        .filter(
          (entry: any) =>
            entry.additionalData &&
            entry.additionalData.tags &&
            entry.additionalData.tags === "burger"
        )
        .map((entry: any) => {
          const name = entry.hologram.filename.replace(".glb", "")
          const storageID = entry.hologram.storageID
          return {
            name: name,
            entryID: entry.id,
            storageID: storageID,
            ingredientType: "",
          }
        })

      setIngredientObjects(burgerIngredients)
      console.log("fetchEcho3dData", burgerIngredients)
    } catch (error) {
      console.error("Error fetching echo3D data:", error)
    }
  }

  const fetchIngredientsData = async () => {
    try {
      const updatedIngredientObjects = await Promise.all(
        ingredientObjects.map(async (ingredient) => {
          const response = await fetch(
            "https://storage.echo3d.com/shrill-dew-9515/" + ingredient.storageID
          )
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
      console.log("fetchIngredientsData", updatedIngredientObjects)
    } catch (error) {
      console.error("Error fetching ingredients data:", error)
    }
  }

  const [ingredientsFetched, setIngredientsFetched] = useState(false);

  useEffect(() => {
    fetchEcho3dData();
  }, []);
  
  useEffect(() => {
    if (!ingredientsFetched && ingredientObjects.length > 0) {
      fetchIngredientsData();
      setIngredientsFetched(true);
      console.log(ingredientObjects);
    }
  }, [ingredientObjects, ingredientsFetched]);

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
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold">Meat</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {meatOptions.map((meatOption: any, index: number) => (
                        <SelectItem
                          key={index}
                          value={meatOption.name}
                          onClick={() => handleObjectToggle(meatOption.name)}
                        >
                          {meatOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <label className="text-sm font-bold">Cheese</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {cheeseOptions.map((cheeseOption: any, index: number) => (
                        <SelectItem
                          key={index}
                          value={cheeseOption.name}
                          onClick={() => handleObjectToggle(cheeseOption.name)}
                        >
                          {cheeseOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="lettuce-checkbox"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectToggle("lettuce")
                          }
                        />
                        <span className="ml-2">Lettuce</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="tomato-checkbox"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectToggle("tomato")
                          }
                        />
                        <span className="ml-2">Tomato</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="top-bun-checkbox"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectToggle("topBun")
                          }
                        />
                        <span className="ml-2">Top Bun</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="bottom-bun-checkbox"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectToggle("bottomBun")
                          }
                        />
                        <span className="ml-2">Bottom Bun</span>
                      </label>
                    </div>
                  </div>
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
