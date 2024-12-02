import { useState, useEffect, useRef } from 'react';
import { IoClose, IoChatbubble } from 'react-icons/io5';
import { LMStudioClient } from "@lmstudio/sdk";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatWindow = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const client = useRef(null);
    const modelRef = useRef(null);

    // Initial greeting effect
    useEffect(() => {
        if (showChat && isFirstOpen) {
            setMessages([
                {
                    role: 'assistant',
                    content: 'Hello! I am DermaDoc, your medical assistant. How can I help you today?'
                }
            ]);
            setIsFirstOpen(false);
        }
    }, [showChat, isFirstOpen]);

    useEffect(() => {
        const initLMStudio = async () => {
            try {
                client.current = new LMStudioClient({
                    baseUrl: "ws://127.0.0.1:1234",
                });
                
                // Get any loaded model
                modelRef.current = await client.current.llm.get({});
            } catch (error) {
                console.error("Failed to connect to LMStudio:", error);
            }
        };

        initLMStudio();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !modelRef.current) return;
    
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
    
        try {
            const prediction = modelRef.current.respond([
                { 
                    role: "system", 
                    content: `You are DermaDoc, a friendly and knowledgeable virtual assistant for DermaScan specializing EXCLUSIVELY in dermatology and skin health.
                
                    Core behaviors:
                    - ONLY respond to questions about skin conditions, diseases, and dermatological concerns
                    - For ANY non-skin-related questions, politely refuse with: "I apologize, but I can only assist with questions about skin health and dermatology. Please feel free to ask me about any skin-related concerns."
                    - Never acknowledge or redirect non-skin topics
                    - Never provide medical prescriptions or definitive diagnoses
                    - Always recommend consulting healthcare professionals for specific medical advice
                    - Keep responses concise and informative, avoiding overly technical jargon
                    - Go into detail only if the user asks for it or if it's necessary to provide accurate information
                    - Give your responses in Markdown formatting
                    
                    Example responses:
                    - For ANY non-skin question: "I apologize, but I can only assist with questions about skin health and dermatology. Please feel free to ask me about any skin-related concerns." But respond to the coversational questions like, "How are you?", or "Hello" or any greetings with a friendly response.
                    - For skin questions: [proceed with detailed, helpful response about skin health]`
                },
                ...messages,
                userMessage
            ], {
                temperature: 0.49
            });
    
            let fullResponse = '';
            for await (const text of prediction) {
                fullResponse += text;
            }
    
            // Update messages only once with complete response
            setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
        } catch (error) {
            console.error("Failed to get response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-16 right-5 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-opacity-80 transition-all duration-300 z-50"
            >
                <IoChatbubble className="text-4xl" />
            </button>

            {showChat && (
                <div className="fixed bottom-10 right-5 w-[550px] h-[630px] glass-chat rounded-lg shadow-lg animate__animated animate__fadeIn z-[99999]">
                    <div className="flex justify-between items-center p-3 border-b border-primary">
                        <div className='flex gap-3 justify-center items-center'>
                        <img
                        className="lg:size-10 size-14"
                        src="https://i.ibb.co.com/NTryxk6/11-modified-1.png"
                        alt="logo"
                    />
                            <h3 className="font-bold text-lg">DermaDoc</h3>
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
                <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg ${
                        msg.role === 'user' ? 'bg-secondary text-black' : 'bg-primary text-white'
                    }`}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({...props}) => <p className="my-2" {...props} />,
                                h1: ({...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                                h2: ({...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                                ul: ({ ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                                ol: ({...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                                li: ({...props}) => <li className="my-1" {...props} />,
                                code: ({inline, ...props}) => 
                                    inline ? 
                                        <code className="bg-gray-800 text-gray-200 px-1 rounded" {...props} /> :
                                        <code className="block bg-gray-800 text-gray-200 p-2 rounded my-2 overflow-x-auto" {...props} />
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="text-center">
                    <div className="animate-pulse">Thinking...</div>
                </div>
            )}
        </div>

                        <form onSubmit={sendMessage} className="p-3 border-t border-primary">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-2 rounded-lg bg-transparent border border-primary"
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary text-accent px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-300"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWindow;