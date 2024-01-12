import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
import { useModal } from "~/context/modal";
import { ReactNode } from "react";
import { useNavigation } from "@remix-run/react";

const Wrapper = ({ children }: { children: ReactNode }) => {
    const modal = useModal();
    const navigation = useNavigation();

    return (
        <>
            {modal.isOpen ? <Modal /> : null}
            <div className={`${modal.isOpen ? "blur-sm" : ""} ${navigation.state === "loading" ? "loading" : ""} flex flex-col min-h-[100vh] justify-between`}>
                <Header />
                <main className="min-h-[85vh] flex-col flex justify-center items-center">{children}</main>
                <Footer />
            </div>
        </>
    )
}

export default Wrapper;
