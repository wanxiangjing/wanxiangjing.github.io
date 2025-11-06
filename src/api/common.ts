import { apiClient } from "@/core/service/request"
import { IUploadRes } from "@/types/upload"

export const fileUpload = (file: File) => {
    return apiClient.post<IUploadRes>('/common/file/upload', { file }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}