import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
import { useModal } from "@context/modal";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const modal = useModal();

    return (
        <>
            {modal.isOpen ? <Modal /> : null}
            <div className={`${modal.isOpen ? "blur-sm" : ""} flex flex-col min-h-[100vh] justify-between`}>
                <Header />
                    <main className="min-h-[85vh] flex-col flex justify-center items-center">
                        <Outlet />
                    </main>
                <Footer />
            </div>
        </>
    )
}

export default Layout;
