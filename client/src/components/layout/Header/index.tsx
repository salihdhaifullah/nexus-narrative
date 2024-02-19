import { FaMoon, FaSun } from "react-icons/fa";
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import ButtonBase from "../../../components/utils/ButtonBase";
import SearchFiled from "../../../components/utils/SearchFiled";
import { useUser, useUserDispatch } from "../../../context/user"
import { useTheme, useThemeDispatch } from "../../../context/theme";
import { useModalDispatch } from "../../../context/modal";
import { MdMoreVert } from "react-icons/md";
import Modal from "./Modal";
import { Form, Link, useNavigation } from "react-router-dom";

const Header = () => {
    const user = useUser();
    const theme = useTheme();
    const navigation = useNavigation();
    const themeDispatch = useThemeDispatch();
    const dispatchModal = useModalDispatch();
    const dispatchUser = useUserDispatch();

    const handelOpenModal = () => {
        dispatchModal({ type: "open", payload: <Modal /> })
    }

    const handelLogout = () => {
        dispatchUser({ type: "logout" })
    }

    return (
        <header className="flex flex-row fixed top-0 w-full z-[11] justify-between items-center text-secondary bg-normal p-2 shadow-lg">
            <div className="flex flex-row gap-2 justify-between sm:justify-normal w-full sm:w-auto">
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img
                        src="/logo.svg"
                        alt="NexusNarrative"
                        title="NexusNarrative"
                        width={45}
                        height={45}
                    />
                </Link>

                <div className="flex sm:hidden flex-row gap-4">
                    <button onClick={() => handelOpenModal()} className="flex text-secondary p-1 h-fit self-center dark:hover:bg-slate-800 hover:bg-slate-200 bg-normal justify-center cursor-pointer items-center rounded-md font-bold text-xl">
                        <MdMoreVert />
                    </button>

                    {!user ? null : (
                        <div className="flex justify-center items-center">
                            <Link to={`/${user.blog}`} title="your profile">
                                <img
                                    className="rounded-full shadow-md object-cover"
                                    width={32}
                                    height={32}
                                    src={user.avatarUrl}
                                    alt={user.name}
                                />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="sm:flex hidden">

                    {!user ? (
                        <Link
                            to="/auth/login"
                            className="w-fit h-fit place-self-center text-secondary p-1 border border-secondary hover:shadow-md bg-normal transition-all ease-in-out rounded-md text-lg flex-row flex gap-1 items-center">
                            <BiLogIn /> <p>login</p>
                        </Link>
                    ) : (
                        <Form action="api/auth/logout" method="post" onSubmit={() => handelLogout()}>
                            <ButtonBase
                                isLoading={navigation.state === "submitting"}
                                className="w-fit h-fit place-self-center text-secondary p-1 border border-secondary hover:shadow-md bg-normal transition-all ease-in-out rounded-md text-lg flex-row flex gap-1 items-center">
                                <BiLogOut />
                                <p>logout</p>
                            </ButtonBase>
                        </Form>
                    )}
                </div>
            </div>

            <div className="sm:flex hidden flex-row justify-center gap-4 items-center">

                <div className="max-w-[400px]">
                    <SearchFiled onClick={() => { }} label="Search" value={""} onChange={() => { }} />
                </div>

                <button
                    onClick={() => themeDispatch({ type: theme === "dark" ? "light" : "dark" })}
                    className="flex dark:text-secondary p-1 dark:hover:bg-slate-800 hover:bg-slate-200 justify-center cursor-pointer items-center rounded-md text-primary font-bold text-2xl">
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </button>

                {!user ? null : (
                    <div className="flex justify-center items-center">
                        <Link to={`/${user.blog}`} title="your profile">
                            <img
                                className="rounded-full shadow-md object-cover"
                                width={32}
                                height={32}
                                src={user.avatarUrl}
                                alt={user.name} />
                        </Link>
                    </div>
                )}
            </div>


        </header>
    )
}

export default Header;
