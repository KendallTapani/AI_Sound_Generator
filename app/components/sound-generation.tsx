//provides UI for generating and playing audio. Users input Text, and click a button to generate audio.
"use client";

import React, { useState } from "react";


const SoundGeneration = () => {
    const [text, setText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleGenerateAudio = async () => {
        if (!text.trim()) return;
        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch("/api/sound-generation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate audio");
            }

            //create and play audio
         const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
         setAudioElement(audio);

         audio.onended = () => setIsPlaying(false); 
         audio.play();
         setIsPlaying(true);
        } catch (error) {
            setError(String(error) || "An unknown error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlayPause = () => {
        if (!audioElement) return;
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">

                {/*Text input*/}
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Text</label>
                    <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What do you want the model to say?"
                    className="w-full h-32 p-2 border rounded-md resize-none"
                    />
                </div>

                {/*error messagge */}
                 {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                    {error}
                    </div>
                 )}

                 {/*controls*/}
                 <div className="flex gap-2">
                    <button
                    onClick={handleGenerateAudio}
                    disabled={isGenerating || !text.trim()}
                    className={`flex-1 px-4 py-2 rounded-md text-white ${
                        isGenerating || !text.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isGenerating ? "Generating..." : "Generate Audio"}
                    </button>

                    {audioElement && (
                        <button
                        onClick={handlePlayPause}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    )}

                 </div>
            </div>
            <button 
                //  onClick={handleFileSave} 
                 className="px-4 py-5 border rounded-md hover:bg-gray-300">
                    Save to Audio Editor
                 </button>
        </div>
    );
};

export default SoundGeneration;