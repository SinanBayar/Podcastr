"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import LoaderSpinner from "./LoaderSpinner";

const RightSidebar = () => {
  const { user } = useUser();
  const { audio } = useAudio();
  const router = useRouter();
  const topUserByPodcastCount = useQuery(api.users.getTopUserByPodcastCount);

  const topPodcasters =
    topUserByPodcastCount &&
    topUserByPodcastCount?.filter((item: any) => item.totalPodcasts > 0);

  if (!topPodcasters) return <LoaderSpinner />;

  return (
    <section
      className={cn("right_sidebar text-white-1 h-lvh", {
        "h-[calc(100vh-128px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow"
            width={24}
            height={24}
          />
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans like you" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-3">
          {topPodcasters.slice(0, 4).map((podcaster) => (
            <div
              key={podcaster._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.firstName}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                ></Image>
                <h2 className="text-14 font-semibold text-white-1">
                  {podcaster.firstName} {podcaster.lastName}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal">
                  {`${podcaster.totalPodcasts} ${podcaster.totalPodcasts !== 1 ? "podcasts" : "podcast\u00A0"}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
