import { SocilTypes } from '@prisma/client';
import { ISocial } from '../static';

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

export interface IUserProfileProps {
    userImage: string | null
    about: string | null
    blogName: string | null
    country: string | null
    city: string | null
    phoneNumber: string | null
    title: string | null
    firstName: string
    lastName: string
    email: string
    social: ISocil[] | null
  }