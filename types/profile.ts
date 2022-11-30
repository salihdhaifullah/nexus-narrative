export interface IUserProfileData {
    profile: string;
    about?: string
    blogName?: string
    country?: string
    city?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: number
    title?: string
}

export interface IUpdateProfileGeneralInformation {
    country: string | null
    city: string | null
    firstName: string 
    lastName: string
    email: string
    phoneNumber: number | null
    title: string | null
    about: string | null
}

export interface IChangeBlogName {
    blogName: string
}

export interface IChangePassword {
    currentPassword: string
    newPassword: string
}

export interface IUserProfileProps {
    userImage: string
    about: string
    blogName: string
    country: string
    city: string
    phoneNumber: string
    title: string
    firstName: string
    lastName: string
    email: string
}

export interface IUploadAvatar {
    fileName: string
    base64: string
}