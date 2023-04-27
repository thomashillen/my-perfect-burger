// "use client";
import React from "react"
import html2canvas from "html2canvas"
import { FacebookShareButton, TwitterShareButton } from "react-share"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

const DownloadSharePanel = () => {
  const downloadImage = async () => {
    const burgerContainer = document.getElementById("burger-customization-area")
    if (!burgerContainer) {
      return
    }

    const canvas = await html2canvas(burgerContainer)
    const imgDataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = imgDataUrl
    link.download = "my-perfect-burger.png"
    link.click()
  }

  const shareUrl = "https://your-website-url.com" // Replace with the URL of your web app
  const title = "Check out my perfect burger!"

  return (
    <div >
      <Card >
        <CardHeader>
          <CardTitle>Download & Share</CardTitle>
          <CardDescription>
            Click to download an image file or share to social media{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button color="primary" variant={"outline"} className="px-2">
                  <Icons.download className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Download Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to download the image of your burger?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={downloadImage}>
                    Download
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <FacebookShareButton url={shareUrl} quote={title}>
              <Button color="primary" variant={"secondary"} className="w-24">
                Share on Facebook
              </Button>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <Button color="primary" variant={"secondary"} className="w-24">
                Share on Twitter
              </Button>
            </TwitterShareButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DownloadSharePanel
