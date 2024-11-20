"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";

const Profile = ({
  params: { profileId },
}: {
  params: { profileId: string };
}) => {
  const podcastsData = useQuery(api.podcasts.podcastDataByAuthorId, {
    authorId: profileId,
  });

  console.log(podcastsData);

  return (
    <section className="flex flex-col mt-9">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div>ProfileCard...</div>
      <section className="flex flex-col mt-9 gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
                {podcastsData
                  ?.slice(0, 4)
                  .map(
                    ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                      <PodcastCard
                        key={_id}
                        imgUrl={imageUrl!}
                        title={podcastTitle}
                        description={podcastDescription}
                        podcastId={_id}
                      />
                    )
                  )}
              </div>
            ) : (
              <EmptyState
                title="You have not created any podcasts yet"
                buttonLink="/create-podcast"
                buttonText="Create Podcast"
              />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </section>
    </section>
  );
};

export default Profile;
