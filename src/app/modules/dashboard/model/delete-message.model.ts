export class DeleteMessageModel {
    deletedMessagesCount: number
    success: boolean
}

export class activeUser {
    success: boolean
    user: {
        n: number
        nModified: number
        ok: number
    }
}
