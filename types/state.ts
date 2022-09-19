import { IUser } from "./user";

export default interface State {
    loading: boolean;
    user: IUser | null;
    error: string | null;
    massage: string | null;
}