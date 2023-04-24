import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          My Perfect Burger <br className="hidden sm:inline" />
          an Echo3D demo
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          This is a demo of Echo3D's 3D model hosting service. It uses Next.js
          and Echo3D's JavaScript SDK to display a 3D model of a burger.
          <br />
          <br />
          You can view the source code for this demo on{" "}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
      </div>

      {/* burger builder container containing the 3d model app and all its buttons */}
      <div className="flex flex-col items-center justify-center w-full h-full max-w-[980px]">
        app goes here
      </div>
      


    </section>
  )
}
