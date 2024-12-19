import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const apiKey = "api_key_here"; //normally stored in .env file
        if (!apiKey) { //check if api key is set
            console.error("ELEVEN_LABS_API_KEY is not set");
            return NextResponse.json({ //return error message
                error: "ELEVEN_LABS_API_KEY is not set" 
            }, 
            { status: 500 }
            );
        }
    const {text} = await request.json(); //extract text and voice from request body

    if (!text) { //checks if text is provided
        return NextResponse.json(
            { error: "Text is required" }, 
            { status: 400 }
        );
    }

    const response = await fetch( //make an HTTP request to the API per Documentation
        `https://api.elevenlabs.io/v1/sound-generation`, 
        {
            method: "POST",
            headers: {
                Accept: "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }),
        }
    );

    //error handling
    if (!response.ok) { //check response status code, if not ok, parse response body as JSON, and inform user everything unfortunately has fallen apart.
        const errorData = await response.json();
        console.error("API Error:", errorData);
        const errorMessage = errorData.detail?.message || "This generation failed completely and totally";
        return NextResponse.json(
            { error: errorMessage },
            { status: response.status }
        );
    }

    const audioBuffer = await response.arrayBuffer(); //convert response to audio buffer
    const audioBase64 = Buffer.from(audioBuffer).toString("base64"); //convert audio buffer to base64 string

    return NextResponse.json({ audio: audioBase64 });
} catch (error) {
    console.error("Error generating audio:", error);
    const errorMessage = typeof error === "object" && error !== null
    ? JSON.stringify(error)
    : String(error) || "An unknown error occurred";
    return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
    );
}
}
