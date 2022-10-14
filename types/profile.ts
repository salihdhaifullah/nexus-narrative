import { SocilTypes } from '@prisma/client';

export interface IUserProfileData {
    Avter?: {
        fileUrl: string
    }
    about?: string
    blogName?: string
    country?: string
    city?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: number
    title?: string
    socil: ISocil[]
}



export interface ISocil {
    name: SocilTypes
    link: string
}

export interface IUpdateProfileGeneralInformation {
    country: string
    city: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: number
    title: string
    about: string
}

export interface IChangeBlogName {
    blogName: string
}

export interface IChangePassword {
    currentPassword: string
    newPassword: string
}

export interface IUploadAvatar {
    fileUrl: string
    name: string
}