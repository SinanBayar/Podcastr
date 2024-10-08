import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import { GenerateThumbnailProps } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";


const GenerateThumbnail = ({
  imageUrl,
  setImageUrl,
  imagePrompt,
  setImagePrompt,
  setImageStorageId,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getImageUrl = useMutation(api.podcasts.getUrl);

  // Uploading and getting URL of image from Convex
  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImageUrl("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });

      // Upload image file to Convex
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);

      // Getting URL of image from Convex
      const imageUrl = await getImageUrl({ storageId });
      setImageUrl(imageUrl!);
      setIsImageLoading(false);
      toast({
        title: "Thumbnail generated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };

  // Generate image using AI for thumbnail
  const generateImage = async () => {};

  // Upload custom image for thumbnail
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", { "bg-black-6": isAiThumbnail })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", { "bg-black-6": !isAiThumbnail })}
        >
          Upload custom image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5 mt-5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate tumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              onClick={generateImage}
              type="submit"
              className="text-16 bg-orange-1 py-4 font-extrabold text-white-1 "
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {imageUrl && (
        <div className="flex-center w-full">
          <Link href={`${imageUrl}`} target="_blank">
            <Image
              src={imageUrl}
              alt="thumbnail"
              width={200}
              height={200}
              className="mt-5"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
