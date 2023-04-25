import React from 'react';
import { Button } from '@/components/ui/button';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import html2canvas from 'html2canvas';
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
} from '@/components/ui/alert-dialog';

const DownloadSharePanel = () => {
  const downloadImage = async () => {
    const burgerContainer = document.getElementById('burger-customization-area');
    if (!burgerContainer) {
      return;
    }

    const canvas = await html2canvas(burgerContainer);
    const imgDataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgDataUrl;
    link.download = 'my-perfect-burger.png';
    link.click();
  };

  const shareUrl = 'https://your-website-url.com'; // Replace with the URL of your web app
  const title = 'Check out my perfect burger!';

  return (
    <div className="flex flex-row items-center content-center gap-4 mt-4">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button color="primary" variant={'outline'} className='pl-2 pr-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
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
            <AlertDialogAction onClick={downloadImage}>Download</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        <FacebookShareButton url={shareUrl} quote={title}>
          <Button color="primary" variant={'secondary'} className="w-24">Share on Facebook</Button>
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <Button color="primary" variant={'secondary'} className="w-24">Share on Twitter</Button>
        </TwitterShareButton>
      <div className="flex gap-4">
      </div>
    </div>
  );
};

export default DownloadSharePanel;
