"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";

const PodcastPlayer = () => {
  const { audio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Play and pause action
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Setting currentTime on audio
  useEffect(() => {
    const audioElement = audioRef.current;
    const updateCurrentTime = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    };
    audioElement?.addEventListener("timeupdate", updateCurrentTime);
    return () =>
      audioElement?.removeEventListener("timeupdate", updateCurrentTime);
  }, []);

  // Autoplay when PodcastPlayer started
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => setIsPlaying(true));
      }
    } else {
      audioElement?.pause();
      setIsPlaying(true);
    }
  }, [audio]);

  // Setting audio duration
  const handleLoadedMetaData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={cn("sticky bottom-0 left-0 flex flex-col size-full", {
        hidden: !audio?.audioUrl || audio?.audioUrl === "",
      })}
    >
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        max={duration}
      />

      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12 relative">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetaData}
          onEnded={handleAudioEnded}
        ></audio>

        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcasts/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              alt="Player"
              width={64}
              height={64}
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[160px] flex-col">
            <h2 className="text-white-1 text-14 font-semibold truncate">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio?.author}</p>
          </div>
        </div>

        <div className="flex-center cursor-pointer gap-3 md:gap-6 absolute left-[50%] translate-x-[-50%]">
          <div className="flex-center items-center gap-1.5">
            <Image
              src="/icons/reverse.svg"
              alt="rewind"
              width={24}
              height={24}
              onClick={() => {}}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            alt="Play"
            width={30}
            height={30}
            onClick={togglePlayPause}
          />
          <div className="flex-center items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4">+5</h2>
            <Image
              src="/icons/forward.svg"
              alt="forward"
              width={24}
              height={24}
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 absolute right-[3rem]">
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {duration}
          </h2>
          <div>
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              alt="Mute-unmute"
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
