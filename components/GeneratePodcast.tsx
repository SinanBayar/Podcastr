import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

// A new hook to define Logic for podcast generation
const useGeneratePodcast = ({
  setAudioUrl,
  setAudioStorageId,
  voiceType,
  voicePrompt,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Getting openAI function using useAction hook
  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudioUrl("");
    if (!voicePrompt) {
      // TODO: show an error message with toast
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      // TODO: show an error message with toast
      setIsGenerating(false);
    }
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  // Using the hook created for podcast generation
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-11 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-extrabold text-white-1 "
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audioUrl && (
        <audio
          controls
          src={props.audioUrl}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
