import { FaMoon, FaSun } from "react-icons/fa/index.js";
import { BiLogOut, BiLogIn } from 'react-icons/bi/index.js';
import ButtonBase from "~/components/utils/ButtonBase";
import SearchFiled from "~/components/utils/SearchFiled";
import { useTheme, useThemeDispatch } from "~/context/theme";
import { useModalDispatch } from "~/context/modal";
import { useUser, useUserDispatch } from "~/context/user";
import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";

const HeaderModal = () => {
  const themeDispatch = useThemeDispatch()
  const dispatchModal = useModalDispatch()
  const userDispatch = useUserDispatch();

  const theme = useTheme();
  const user = useUser();


  const handelSearch = () => {
    dispatchModal({ payload: null, type: "close" })
  }

  const handelTheme = () => {
    themeDispatch({ type: theme === "dark" ? "light" : "dark" })
    dispatchModal({ payload: null, type: "close" })
  }

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-900 h-full flex-1 flex flex-col gap-4 p-2 items-start justify-evenly">

      <ButtonBase
        onClick={() => handelTheme()}
        className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
        {theme === "dark" ? <FaMoon /> : <FaSun />}
        <p>change theme</p>
      </ButtonBase>

      {user === null ? (
        <Link
          to="/auth/login"
          onClick={() => dispatchModal({ payload: null, type: "close" })}
          className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
          <BiLogIn /> <p>login</p>
        </Link>
      ) : (
        <ButtonBase
          onClick={() => {}}
          className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
          <BiLogOut />
          <p>logout</p>
        </ButtonBase>
      )}

      <div className="w-full">
        <SearchFiled onClick={handelSearch} label="Search" value={""} onChange={(e) => {}} />
      </div>

    </div>
  )
}

export default HeaderModal;


