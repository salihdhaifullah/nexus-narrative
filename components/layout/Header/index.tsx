import { FaMoon, FaSun } from "react-icons/fa";
import { BiLogOut, BiLogIn } from 'react-icons/bi';

import ButtonBase from "@/components/utils/ButtonBase";
import SearchFiled from "@/components/utils/SearchFiled";

import useQuery from "@/hooks/useQuery";

import { useUser, useUserDispatch } from "@/context/user"
import { useTheme, useThemeDispatch } from "@/context/theme";
import { useModalDispatch } from "@/context/modal";

import { useState } from "react";

import { MdMoreVert } from "react-icons/md";
import Modal from "./Modal";

import Image from "next/image";
import Link from "next/link";
import useFetchApi from "@/hooks/useFetchApi";
import { useRouter } from "next/navigation";

const Header = () => {
    const user = useUser();
    const theme = useTheme();
    const query = useQuery();
    const [search, setSearch] = useState(query.get("search") || "");

    const themeDispatch = useThemeDispatch();
    const router = useRouter();
    const userDispatch = useUserDispatch();
    const dispatchModal = useModalDispatch();

    const [logoutPayload, callLogout] = useFetchApi("DELETE", "auth/logout", [], () => {
        userDispatch({ type: "logout" })
    });

    const handelSearch = () => {
        router.push(`/search?search=${search}`)
    }

    const handelOpenModal = () => {
        dispatchModal({type: "open", payload: <Modal />})
    }

    return (
        <header className="flex flex-row fixed top-0 w-full z-[11] justify-between items-center text-secondary bg-normal p-2 shadow-lg">
            <div className="flex flex-row gap-2 justify-between sm:justify-normal w-full sm:w-auto">
                <Link href="/" className="flex flex-row justify-center items-center">
                    <Image
                      src="/logo.svg"
                      alt="NexusNarrative"
                      title="NexusNarrative"
                      width={45}
                      height={45}
                    />
                </Link>

                <div className="flex sm:hidden flex-row gap-4">
                    <div onClick={handelOpenModal} className="flex text-secondary p-1 h-fit self-center hover:bg-primary bg-normal justify-center cursor-pointer items-center rounded-md font-bold text-xl">
                        <MdMoreVert />
                    </div>

                    {user && (
                        <div className="flex justify-center items-center">
                            <Link href={`/users/${user.id}`} title="your profile">
                                <Image
                                    className="rounded-full dark:shadow-secondary/40 shadow-md object-cover"
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

                    {user === null ? (
                        <Link
                            href="/auth/login"
                            className="w-fit text-secondary hover:bg-primary bg-normal transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                            <BiLogIn /> <p>login</p>
                        </Link>
                    ) : (
                        <ButtonBase
                            onClick={() => callLogout()}
                            isLoading={logoutPayload.isLoading}
                            className="w-fit text-secondary hover:bg-primary bg-normal transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                            <BiLogOut />
                            <p>logout</p>
                        </ButtonBase>
                    )}
                </div>
            </div>

            <div className="sm:flex hidden flex-row justify-center gap-4 items-center">

                <div className="max-w-[400px]">
                    <SearchFiled onClick={handelSearch} label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div
                    onClick={() => themeDispatch({ type: theme === "dark" ? "light" : "dark" })}
                    className="flex dark:text-secondary p-1 dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-2xl">
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </div>

                {user && (
                    <div className="flex justify-center items-center">
                        <Link href={`/users/${user.id}`} title="your profile">
                            <Image
                                className="rounded-full dark:shadow-secondary/40 shadow-md object-cover"
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
