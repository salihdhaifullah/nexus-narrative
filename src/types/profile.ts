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

export interface IChangePassword {
    currentPassword: string
    newPassword: string
}

export interface IViews {
    _count: number;
    monthAndYear: string
}
