import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import BurgerCustomizationArea from "@/components/BurgerCustomizationArea"
import { Icons } from "@/components/icons"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          My Perfect Burger <br className="hidden sm:inline" />
        </h1>
        <p className="text-muted-foreground max-w-[700px] md:text-lg ">
          This is a demo of Echo3D&apos;s 3D model hosting service. It uses
          Next.js and Echo3D&apos;s JavaScript SDK to display a 3D model of a
          burger.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({  })}
        >
          <Icons.docs className="mr-4 h-5 w-5" />
          Echo3D docs
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          <Icons.gitHub className=" h-5 w-5" />
        </Link>
      </div>

      {/* burger builder container containing the 3d model app and all its buttons */}
      <div className="flex h-full w-full max-w-[980px] flex-col items-center justify-center">
        <BurgerCustomizationArea />
      </div>
    </section>
  )
}
