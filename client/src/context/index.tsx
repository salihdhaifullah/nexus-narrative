import { ReactElement } from "react";
import UserProvider from "./user";
import ThemeProvider from "./theme";
import ModalProvider from "./modal";
import HeadProvider from "./head";

export default function Provider({ children }: { children: (ReactElement | null)[] | ReactElement | null }) {
    return (
        <UserProvider>
            <ThemeProvider>
                <HeadProvider>
                <ModalProvider>
                    <>{children}</>
                </ModalProvider>
                </HeadProvider>
            </ThemeProvider>
        </UserProvider>
    )
}
