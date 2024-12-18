"use client";

import { PodcastDetailPlayerProps } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import LoaderSpinner from "./LoaderSpinner";
import { useAudio } from "@/providers/AudioProvider";
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
} from "@/components/ui/alert-dialog";

const PodcastDetailPlayer = ({
  isOwner,
  podcastId,
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  imageStorageId,
  audioStorageId,
  authorImageUrl,
  authorId,
}: PodcastDetailPlayerProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  const router = useRouter();
  const { audio, setAudio } = useAudio();
  const { toast } = useToast();

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioUrl,
      author,
      imageUrl,
      podcastId,
    });
    console.log(audio);
  };

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({ title: "Podcast deleted" });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({ title: "Error deleting podcast", variant: "destructive" });
    }
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          alt="Podcast image"
          width={250}
          height={250}
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1 max-md:text-center">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => router.push(`/profile/${authorId}`)}
            >
              <Image
                src={authorImageUrl}
                alt={"Profile icon"}
                width={30}
                height={30}
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>
          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              alt="Random play"
              width={20}
              height={20}
            />{" "}
            &nbsp;Play podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            alt="Three dots icon"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <AlertDialog>
              <AlertDialogTrigger className="bg-black-5">
                <div className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2">
                  <Image
                    src="/icons/delete.svg"
                    alt="Delete icon"
                    width={16}
                    height={16}
                  />
                  <h2 className="text-16 font-normal text-white-1">Delete</h2>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-white-1 bg-black-3">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this podcast?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your podcast.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 border border-white-1"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
