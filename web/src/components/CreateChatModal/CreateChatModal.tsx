import React, { useState } from 'react'
import { Modal } from '../Modal/Modal'
import { useActions } from '../../state/hooks'
import { useNavigate } from 'react-router-dom'
import { ChatSchema } from '@nicholas/types'

interface CreateChatModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    })
    const actions = useActions()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) return

        const newChat: ChatSchema = {
            title: formData.title.trim(),
            description: formData.description.trim(),
        }

        actions.upsertChat({
            chats: {
                chats: [
                    {
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                    },
                ],
            },
            handleSuccess: (id: string) => {
                setFormData({
                    title: '',
                    description: '',
                })
                onClose()
                actions.setActiveChatId(id)
                navigate(`/chats/${id}`)
            },
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Chat">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={e =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter chat title"
                        autoFocus
                    />
                </div>
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter chat description"
                        autoFocus
                    />
                </div>
                <div className="flex justify-center space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={
                            !formData.title.trim() ||
                            !formData.description.trim()
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    )
}
