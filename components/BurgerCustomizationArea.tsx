"use client"

// Import required libraries and components
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import * as THREE from "three"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"

import "react-toastify/dist/ReactToastify.css"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Main component for the Burger Customization Area
const BurgerCustomizationArea = () => {
  // Declare state variables and refs
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [loadedIngredients, setLoadedIngredients] = useState(false)
  const [cheeseOptions, setCheeseOptions] = useState<any[]>([])
  const [meatOptions, setMeatOptions] = useState<any[]>([])
  const [selectedMeat, setSelectedMeat] = useState<string | null>(null)
  const [selectedCheese, setSelectedCheese] = useState<string | null>(null)

  // Ingredient object properties
  type IngredientObject = {
    name: string
    entryID: string
    storageID: string
    ingredientType: string
    blob?: Blob | null
  }

  // State to hold all the ingredient objects (here its using a list of dictionaries)
  const [ingredientObjects, setIngredientObjects] = useState<
    IngredientObject[]
  >([])

  // Fetch all ingredients data from API
  const fetchAllData = async () => {
    try {
      const apiKey = "abcd-efgh-1234" //replace with your api key to access your Echo3D console database
      const response = await fetch("https://api.echo3D.com/query?key=" + apiKey)
      const json = await response.json()
      console.log(json)

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
          const ingredientType = entry.additionalData.ingredientType || ""
          return {
            name: name,
            entryID: entry.id,
            storageID: storageID,
            ingredientType: ingredientType,
          }
        })

      const updatedIngredientObjects = await Promise.all(
        burgerIngredients.map(async (ingredient) => {
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
      console.log(
        "All burger ingredients have been fetched and loaded successfully.",
        updatedIngredientObjects
      )
    } catch (error) {
      console.error("Error fetching echo3D data:", error)
    }
  }

  // Fetch all data when the component mounts
  useEffect(() => {
    fetchAllData()
  }, [])

  // Function to position an ingredient in the scene
  const positionIngredient = (
    ingredientName: string,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3
  ) => {
    // Positioning logic
    if (scene) {
      const ingredient = scene.children.find(
        (object) => object.userData.name === ingredientName
      )

      if (ingredient instanceof THREE.Object3D) {
        ingredient.position.copy(position)
        ingredient.rotation.copy(rotation)
        ingredient.scale.copy(scale)
      }
    }
  }

  // Handle adding/removing an object in the scene
  const handleObjectToggle = async (
    ingredientName: string,
    ingredientType: string
  ) => {
    // Function to get position, rotation, and scale for each ingredient type
    const getPositionForIngredient = (
      ingredientType: string
    ): [THREE.Vector3, THREE.Euler, THREE.Vector3] => {
      // Define the position, rotation, and scale for each ingredient type here
      // For example:
      if (ingredientType === "meat") {
        return [
          new THREE.Vector3(0, -0.5, 0),
          new THREE.Euler(Math.PI / 2, 0, 0),
          new THREE.Vector3(10, 10, 10),
        ]
      } else if (ingredientType === "cheese") {
        return [
          new THREE.Vector3(0, 0, 0),
          new THREE.Euler(0, 0, 0),
          new THREE.Vector3(0.9, 0.9, 0.9),
        ]
      } else if (ingredientType === "lettuce") {
        return [
          new THREE.Vector3(0, 9, 0),
          new THREE.Euler(Math.PI / 2, 0, 0),
          new THREE.Vector3(1, 1, 1),
        ]
      } else if (ingredientType === "tomato") {
        return [
          new THREE.Vector3(0, 7.5, 0),
          new THREE.Euler(Math.PI / 2, 0, 0),
          new THREE.Vector3(1, 1, 1),
        ]
      } else if (ingredientType === "topBun") {
        return [
          new THREE.Vector3(0, -0.5, 0),
          new THREE.Euler(Math.PI, 0, 0),
          new THREE.Vector3(10, 10, 10),
        ]
      } else if (ingredientType === "bottomBun") {
        return [
          new THREE.Vector3(0, -1.5, 0),
          new THREE.Euler(Math.PI / 2, 0, 0),
          new THREE.Vector3(10, 10, 10),
        ]
      } else {
        return [
          new THREE.Vector3(0, 0, 0),
          new THREE.Euler(0, 0, 0),
          new THREE.Vector3(1, 1, 1),
        ]
      }
    }

    // Main logic for adding/removing objects in the scene
    const [position, rotation, scale] = getPositionForIngredient(ingredientType)
    positionIngredient(ingredientName, position, rotation, scale)

    if (!loadedIngredients) {
      toast.error("Ingredients data not loaded.")
      return
    }
    if (ingredientName === null) {
      removeIngredient(ingredientType)
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
        if (ingredientType === "meat") {
          setSelectedMeat(null)
        } else if (ingredientType === "cheese") {
          setSelectedCheese(null)
        }
      } else {
        const loader = new GLTFLoader()
        try {
          const gltf = await loader.loadAsync(objectURL)
          gltf.scene.userData.name = ingredientName
          gltf.scene.position.copy(position)
          gltf.scene.rotation.copy(rotation)
          gltf.scene.scale.copy(scale)
          scene.add(gltf.scene)
          if (ingredientType === "meat") {
            setSelectedMeat(ingredientName)
          } else if (ingredientType === "cheese") {
            setSelectedCheese(ingredientName)
          }
        } catch (error) {
          console.error("Error loading object:", error)
          toast.error("Failed to load object.")
        }
      }
    } else {
      toast.error("Scene not loaded.")
    }
  }

  // Initialize scene, camera, renderer, and event listeners
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    // Initialization logic‚
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

    // Clean up on component unmount
    return () => {
      renderer.dispose()
      currentContainerRef?.removeChild(renderer.domElement)
      window.removeEventListener("resize", onWindowResize)
    }
  }, [containerRef])

  // Function to remove an ingredient from the scene
  const removeIngredient = (ingredientType: string) => {
    if (scene) {
      const ingredientToRemove = scene.children.find(
        (object) =>
          object.userData.name &&
          ingredientObjects.find(
            (i) =>
              i.name === object.userData.name &&
              i.ingredientType === ingredientType
          )
      )

      if (ingredientToRemove) {
        scene.remove(ingredientToRemove)
      }
    } else {
      toast.error("Scene not loaded.")
    }
    if (ingredientType === "meat") {
      setSelectedMeat(null)
    } else if (ingredientType === "cheese") {
      setSelectedCheese(null)
    }
  }

  // Update meat and cheese options when ingredients are loaded
  useEffect(() => {
    if (loadedIngredients) {
      const meats = ingredientObjects.filter(
        (ingredient) => ingredient.ingredientType === "meat"
      )
      setMeatOptions(meats)

      const cheeses = ingredientObjects.filter(
        (ingredient) => ingredient.ingredientType === "cheese"
      )
      setCheeseOptions(cheeses)
    }
  }, [loadedIngredients, ingredientObjects])

  // Handle changes in ingredient selection
  type Ingredient = {
    // properties of Ingredient
    type: string
  }
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>,
    type: Ingredient["type"]
  ) => {
    // Handle selection changes
    const value = event.target.value
    if (value === "None") {
      removeIngredient(type)
    } else {
      removeIngredient(type)
      handleObjectToggle(value, type)
    }
  }

  // Render the main component with UI elements and 3D scene
  return (
    // JSX structure and event handling
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
                  <label className="text-sm font-bold">Meat options:</label>
                  {/* Meat */}
                  <select
                    value={selectedMeat || "None"}
                    onChange={(event) => handleChange(event, "meat")}
                  >
                    <option value="None">None</option>
                    {meatOptions.map((meatOption, index) => (
                      <option key={index} value={meatOption.name}>
                        {meatOption.name}
                      </option>
                    ))}
                  </select>

                  <label className="text-sm font-bold">Cheese options:</label>
                  {/* Cheese */}
                  <select
                    value={selectedCheese || "None"}
                    onChange={(event) => handleChange(event, "cheese")}
                  >
                    <option value="None">None</option>
                    {cheeseOptions.map((cheeseOption, index) => (
                      <option key={index} value={cheeseOption.name}>
                        {cheeseOption.name}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="lettuce-checkbox"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectToggle("lettuce", "lettuce")
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
                            handleObjectToggle("tomato", "tomato")
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
                            handleObjectToggle("topBun", "topBun")
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
                            handleObjectToggle("bottomBun", "bottomBun")
                          }
                        />
                        <span className="ml-2">Bottom Bun</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default BurgerCustomizationArea
