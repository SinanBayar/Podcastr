import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/hooks/use-toast";

// A new hook to define Logic for podcast generation
const useGeneratePodcast = ({
  setAudioUrl,
  setAudioStorageId,
  voiceType,
  voicePrompt,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  // Getting openAI function using useAction hook
  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudioUrl("");

    if (!voicePrompt || !voiceType) {
      toast({
        title:
          "Please provide a AI prompt and a voice type to generate a podcast",
      });
      return setIsGenerating(false);
    }
    try {
      // Getting voice file from openAI
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      // Upload voice file to Convex
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      // Getting URL of audio from Convex
      const audioUrl = await getAudioUrl({ storageId });
      setAudioUrl(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
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
          onClick={generatePodcast}
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
