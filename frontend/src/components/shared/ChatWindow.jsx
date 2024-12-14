import { useState, useEffect, useRef } from "react";
import { IoClose, IoChatbubble } from "react-icons/io5";
import { LMStudioClient } from "@lmstudio/sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatWindow = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [streamingMessage, setStreamingMessage] = useState("");
    const client = useRef(null);
    const modelRef = useRef(null);

    // Initial greeting effect
    useEffect(() => {
        if (showChat && isFirstOpen) {
            setMessages([
                {
                    role: "assistant",
                    content:
                        "Hello! I am DermaDoc, your medical assistant. How can I help you today?",
                },
            ]);
            setIsFirstOpen(false);
        }
    }, [showChat, isFirstOpen]);

    useEffect(() => {
        const initLMStudio = async () => {
            try {
                client.current = new LMStudioClient({
                    baseUrl: "ws://127.0.0.1:1235",
                });

                // Get any loaded model
                modelRef.current = await client.current.llm.get({});
            } catch (error) {
                console.error("Failed to connect to LMStudio:", error);
            }
        };

        initLMStudio();
    }, []);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Add useEffect for auto-scroll
    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !modelRef.current) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setStreamingMessage(""); // Reset streaming message

        try {
            const prediction = modelRef.current.respond(
                [
                    {
                        role: "system",
                        content: `You are DermaDoc, a friendly and knowledgeable virtual assistant for DermaScan specializing EXCLUSIVELY in dermatology and skin health.

Core Guidelines:

    Scope of Assistance:
        Respond exclusively to skin health and dermatology-related questions.
        For non-skin-related questions, politely refuse with:

            "I apologize, but I can only assist with questions about skin health and dermatology. Please feel free to ask me about any skin-related concerns."

        Do not redirect to other topics.

    Medical Disclaimer:
        Avoid providing medical prescriptions or definitive diagnoses.
        Always recommend consulting healthcare professionals for specific advice.

    Response Style:
        Always format responses in Markdown.
        Use appropriate headings, bullet points, and formatted text to organize responses.
        Maintain a concise and warm tone, avoiding overly technical language unless requested.
        Provide detailed explanations only when necessary or if explicitly requested.

    Conversational Etiquette:
        Respond warmly to greetings like "Hello" or "How are you?"
        Maintain a friendly and approachable tone in all responses.


Example Responses

For Non-Skin-Related Questions:

    "I apologize, but I can only assist with questions about skin health and dermatology. Please feel free to ask me about any skin-related concerns."

For Skin-Related Questions:

    Use Markdown to provide structured, informative, and helpful content. 

About DermaScan:  

AI-Powered Skin Disease Detection

    Detect and analyze skin conditions with the power of artificial intelligence—fast, accurate, and non-invasive.

How It Works:

    Upload Image: Simply upload a clear image of the affected skin area.
    AI Analysis: Our advanced AI analyzes the image for potential skin conditions.
    Get Results: Receive a detailed report with potential diagnoses and next steps.

Feel free to ask any questions about skin health or how DermaScan can assist you!  `,
                    },
                    ...messages,
                    userMessage,
                ],
                {
                    temperature: 0.49,
                }
            );

            let fullResponse = "";

            // Add temporary streaming message
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "" },
            ]);

            for await (const text of prediction) {
                fullResponse += text;
                setStreamingMessage(fullResponse); // Update streaming text
                // Update the last message in real-time
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { role: "assistant", content: fullResponse },
                ]);
            }
        } catch (error) {
            console.error("Failed to get response:", error);
        } finally {
            setStreamingMessage("");
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed z-50 p-3 text-white transition-all duration-300 rounded-full cursor-pointer bottom-16 right-5 bg-primary hover:bg-opacity-80"
            >
                <IoChatbubble className="text-4xl" />
            </button>

            {showChat && (
                <div className="fixed bottom-10 right-5 w-[600px] h-[630px] glass-chat rounded-lg shadow-lg animate__animated animate__fadeIn z-[99999]">
                    <div className="flex items-center justify-between p-3 border-b border-primary">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                className="lg:size-10 size-14"
                                src="https://i.ibb.co.com/NTryxk6/11-modified-1.png"
                                alt="logo"
                            />
                            <h3 className="text-lg font-bold">DermaDoc</h3>
                        </div>
                        <button
                            onClick={() => setShowChat(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <IoClose className="text-xl text-red-500 " />
                        </button>
                    </div>

                    <div className="flex flex-col h-[calc(100%-4rem)]">
                        <div className="flex-1 p-4 overflow-auto">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-4 ${
                                        msg.role === "user"
                                            ? "text-right"
                                            : "text-left"
                                    }`}
                                >
                                    <div
                                        className={`inline-block p-2 rounded-lg ${
                                            msg.role === "user"
                                                ? "bg-secondary text-black"
                                                : "bg-primary text-white"
                                        }`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ ...props }) => (
                                                    <p
                                                        className="my-2"
                                                        {...props}
                                                    />
                                                ),
                                                h1: ({ ...props }) => (
                                                    <h1
                                                        className="my-4 text-2xl font-bold"
                                                        {...props}
                                                    />
                                                ),
                                                h2: ({ ...props }) => (
                                                    <h2
                                                        className="my-3 text-xl font-bold"
                                                        {...props}
                                                    />
                                                ),
                                                ul: ({ ...props }) => (
                                                    <ul
                                                        className="my-2 ml-4 list-disc"
                                                        {...props}
                                                    />
                                                ),
                                                ol: ({ ...props }) => (
                                                    <ol
                                                        className="my-2 ml-4 list-decimal"
                                                        {...props}
                                                    />
                                                ),
                                                li: ({ ...props }) => (
                                                    <li
                                                        className="my-1"
                                                        {...props}
                                                    />
                                                ),
                                                code: ({ inline, ...props }) =>
                                                    inline ? (
                                                        <code
                                                            className="px-1 text-gray-200 bg-gray-800 rounded"
                                                            {...props}
                                                        />
                                                    ) : (
                                                        <code
                                                            className="block p-2 my-2 overflow-x-auto text-gray-200 bg-gray-800 rounded"
                                                            {...props}
                                                        />
                                                    ),
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form
                            onSubmit={sendMessage}
                            className="p-3 border-t border-primary"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-2 bg-transparent border rounded-lg border-primary disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                />
                                {!isLoading && <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 transition-colors duration-300 rounded-lg bg-primary text-accent hover:bg-opacity-80"
                                >
                                    Send
                                </button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWindow;
