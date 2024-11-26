"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const PodcastPlayer = () => {
  const { audio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

  // Skip forward and rewind
  const forward = () => {
    const audioElement = audioRef.current;
    if (
      audioElement &&
      audioElement.currentTime &&
      audioElement.duration &&
      audioElement.currentTime + 5 < audioElement.duration
    ) {
      audioElement.currentTime += 5;
    }
  };

  const rewind = () => {
    const audioElement = audioRef.current;
    if (
      audioElement &&
      audioElement.currentTime &&
      audioElement.currentTime - 5 > 0
    ) {
      audioElement.currentTime -= 5;
    } else if (audioElement && audioElement.currentTime) {
      audioElement.currentTime = 0;
    }
  };

  // Mute and unmute audio
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  // Volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  // Setting volume when audio started
  useEffect(() => {
    const audioElement = audioRef.current;
    const updateVolume = () => {
      if (audioElement) {
        setVolume(audioElement.volume * 100);
      }
    };

    audioElement?.addEventListener("volumechange", updateVolume);
    return () =>
      audioElement?.removeEventListener("volumechange", updateVolume);
  }, []);

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

      <section className="glassmorphism-black flex max-md:h-[80px] h-[112px] w-full items-center justify-between px-4 max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetaData}
          onEnded={handleAudioEnded}
        ></audio>

        <div className="flex items-center md:gap-4">
          <Link href={`/podcasts/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              alt="Player"
              width={64}
              height={64}
              className="aspect-square rounded-xl max-md:hidden"
            />
          </Link>
          <div className="flex max-w-[160px] flex-col gap-1">
            <h2 className="text-white-1 text-14 font-semibold truncate max-md:hidden">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2 max-md:hidden">
              {audio?.author}
            </p>
            <div className="text-12 font-bold text-white-1">
              {`${formatTime(currentTime)} / ${formatTime(duration)}`}
            </div>
          </div>
        </div>

        <div className="flex-center cursor-pointer gap-3 md:gap-6 absolute left-[50%] translate-x-[-50%]">
          <div className="flex-center items-center gap-1.5">
            <Image
              src="/icons/reverse.svg"
              alt="rewind"
              width={24}
              height={24}
              onClick={rewind}
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
              onClick={forward}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-between">
          <div>
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              alt="Mute-unmute"
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={toggleMute}
            />
          </div>
          <h2 className="bg-white-1 rounded-[10px] max-md:hidden w-[100px]">
            <Slider
              value={[isMuted ? 0 : volume]}
              defaultValue={[100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
            />
          </h2>
          <div className="text-14 font-semibold text-white-1 w-8 max-md:hidden">
            {isMuted ? 0 : Math.floor(volume)}%
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
