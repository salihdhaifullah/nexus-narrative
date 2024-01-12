import { ReactElement } from "react";
import UserProvider from "./user";
import ThemeProvider from "./theme";
import ModalProvider from "./modal";

export default function Provider({ children }: { children: (ReactElement | null)[] | ReactElement | null }) {
    return (
        <UserProvider>
            <ThemeProvider>
                <ModalProvider>
                    <>{children}</>
                </ModalProvider>
            </ThemeProvider>
        </UserProvider>
    )
}
