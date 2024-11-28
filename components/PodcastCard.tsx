import { api } from "@/convex/_generated/api";
import { PodcastCardProps } from "@/types";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PodcastCard = ({
  imgUrl,
  title,
  description,
  podcastId,
}: PodcastCardProps) => {
  const router = useRouter();
  const increasePodcastView = useMutation(api.podcasts.updatePodcastViews);

  // Checks if the podcast was viewed today and updates the view count if not.
  const handleViews = async () => {
    const todayDate = new Date().toISOString().split("T")[0];
    const viewedPodcasts: Record<string, string> = JSON.parse(
      localStorage.getItem("viewedPodcasts") || "{}"
    );
    const lastViewedDate = viewedPodcasts[podcastId];

    if (lastViewedDate !== todayDate) {
      await increasePodcastView({ podcastId });
      viewedPodcasts[podcastId] = todayDate;
      localStorage.setItem("viewedPodcasts", JSON.stringify(viewedPodcasts));
    } else {
      console.log("Already counted for today");
    }
    router.push(`/podcasts/${podcastId}`, { scroll: true });
  };

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal text-white-1 capitalize">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
