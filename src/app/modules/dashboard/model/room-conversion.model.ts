export class RoomConversionModel {
    conversation: [
        {
            chatRoomId?: string,
            createdAt?: string,
            message?: {
                messageText?: string,
                replyMessageId?: string,
                replyMessageText?: string
            }
            messageId?: string,
            postedByUser?: {},
            readByRecipients?:[{}],
            roomInfo?:[],
            type?: string,
            _id?: string
        }
    ]
    success: boolean
}

export class SendMessageConversationModel {
    post: {
        chatRoomId?: string,
        chatRoomInfo?: [{}],
        createdAt?: string
        message?: {
            messageText?: string,
            replyMessageText?: string,
            replyMessageId?: string
        }
        postId?: string
        postedByUser?: {},
        readByRecipients?: [{}]
        type?: string
        updatedAt?: string
        _id?: string
    }
    success: boolean
}

export class ParticularConversationModel {
    conversation:[
        {
            Users?: [
                {
                    createdAt: string
                    email: string
                    firstName: string
                    isActive: boolean
                    lastName: string
                    password: string
                    role: string
                    updatedAt: string
                    userName: string
                    _id: string
                }
            ]
            chatRoomId?: string,
            createdAt?: string,
            message?: any,
            postId?: string,
            image?: [
                {
                    imageName?: string,
                    imagePath?: string,
                    photo?: boolean,
                    video?: boolean,
                }
            ],
            forwardByUser?: {
                createdAt: string,
                email: string,
                firstName: string,
                isActive: boolean,
                lastName: string,
                password: string,
                role: string,
                updatedAt: string,
                userName: string,
                _id: string,
            },
            forwardToUser?: [
                chatRoomId?: string,
                userId?: string
            ],
            forwardToUserObject?: {
                createdAt: string
                email: string
                firstName: string
                isActive: boolean
                lastName: string
                password: string
                role: string
                updatedAt: string
                userName: string
                _id: string
            }
            messageId?: string
            postedByUser?: {
                createdAt: string
                email: string
                firstName: string
                isActive: boolean
                lastName: string
                password: string
                role: string
                updatedAt: string
                userName: string
                __v: 0
                _id: string
            }
            readByRecipients?: [{}]
            type?: string
            updatedAt?: string
            __v: number
            _id: string
        }
    ]
    success: boolean
    users?: [
        {
            createdAt: string
            email: string
            firstName: string
            isActive: boolean
            lastName: string
            password: string
            role: string
            updatedAt: string
            userName: string
            __v: number
            _id: string
        }
    ]

}
