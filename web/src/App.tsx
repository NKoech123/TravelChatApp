import React, { useState } from 'react';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
}

export function App() {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const chats: Chat[] = [
        { id: '1', name: 'Lumbumbashi', lastMessage: 'Are there any rivers in here?', timestamp: '4 days ago' },
        { id: '2', name: 'New York Travel', lastMessage: 'How is the weather?', timestamp: '4 days ago' },
        { id: '3', name: 'San Diego Chat', lastMessage: 'Best beaches?', timestamp: '4 days ago' },
        { id: '4', name: 'Berkeley Cal', lastMessage: 'Campus tour', timestamp: '4 days ago' },
        { id: '5', name: 'Kisumu, Kenya', lastMessage: 'Local cuisine', timestamp: '4 days ago' },
        { id: '6', name: 'Osaka, Japan', lastMessage: 'Temple visits', timestamp: '5 days ago' },
        { id: '7', name: 'Gweru, Zimbabwe', lastMessage: 'Safari tours', timestamp: '5 days ago' },
    ];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            // Handle sending message here
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f4]">
            <div className="grid grid-cols-[400px,1fr] h-screen">
                {/* Left Panel - Chat List */}
                <div className="bg-[#faf7f4] overflow-y-auto">
                    <div className="p-4">
                        <h1 className="text-2xl font-semibold mb-4">Chat with me</h1>
                        <div className="space-y-2">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`p-4 bg-white rounded-2xl cursor-pointer transition-colors ${activeChat === chat.id ? 'shadow-sm' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{chat.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">{chat.timestamp}</span>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 bg-black text-white p-4 rounded-xl font-medium hover:bg-gray-900 transition-colors">
                            + CREATE NEW
                        </button>
                    </div>
                </div>

                {/* Right Panel - Active Chat */}
                <div className="flex flex-col h-screen bg-white">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="border-b border-gray-100 p-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <h2 className="text-xl font-semibold">
                                        {chats.find(chat => chat.id === activeChat)?.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-white">
                                <div className="space-y-4">
                                    <div className="bg-[#f8f4ee] rounded-lg p-3 max-w-[80%] self-start">
                                        Are there any rivers in here?
                                    </div>
                                    <div className="bg-black text-white rounded-lg p-3 max-w-[80%] ml-auto">
                                        In Lubumbashi, while you won't find major rivers running directly through the city...
                                        <button className="block text-sm mt-2 text-gray-400">Show more</button>
                                    </div>
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="border-t border-gray-100 p-4">
                                <form onSubmit={handleSendMessage} className="flex items-center">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us your travel plans..."
                                        className="flex-1 p-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
                                    />
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

