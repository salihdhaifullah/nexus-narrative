import { Dispatch, ReactElement, createContext, useContext, useReducer, useEffect, useState } from 'react';
import isServer from '~/utils/isServer';

type IUserAction = {
  type: "add" | "logout";
  payload?: IUser;
};

export interface IUser {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
}

const UserContext = createContext<IUser | null>(null);
const UserDispatchContext = createContext<Dispatch<IUserAction>>(() => null);

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function userReducer(user: IUser | null, action: IUserAction): IUser | null {
  switch (action.type) {
    case 'add': {
      if (!action.payload) return user;
      localStorage.setItem("user", JSON.stringify(action.payload));
      user = action.payload;
      return user;
    }
    case 'logout': {
      localStorage.removeItem("user");
      user = null;
      return user;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function UserProvider({ children }: { children: ReactElement }) {
  const [isInitialRenderComplete, setInitialRenderComplete] = useState(false);

  const isUser = !isServer() ? localStorage.getItem("user") : null;
  const user: IUser | null = isUser ? JSON.parse(isUser) : null;

  const [User, dispatchUser] = useReducer(userReducer, user);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!isInitialRenderComplete) return null;

  return (
    <UserContext.Provider value={User}>
      <UserDispatchContext.Provider value={dispatchUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
