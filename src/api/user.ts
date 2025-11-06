import { apiClient } from "@/core/service/request";
import { IUser } from "@/types/user";

export const apiUpdateAvatar = (avatarUrl: string) => {
    return apiClient.post<IUser>('/user/update_avatar', { avatar: avatarUrl });
}