import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
import { useModal } from "context/modal";
import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => {
    const modal = useModal();

    return (
        <>
            {modal.isOpen ? <Modal /> : null}
            <div className={`${modal.isOpen ? "blur-sm" : ""} flex flex-col min-h-[100vh] justify-between`}>
                <Header />
                <main className="min-h-[85vh] flex-col flex justify-center items-center">{children}</main>
                <Footer />
            </div>
        </>
    )
}

export default Wrapper;
