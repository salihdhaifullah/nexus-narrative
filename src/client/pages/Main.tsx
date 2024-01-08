import { Footer } from "../components/Footer";

const Main = () => {
  return (
    <div className="flex bg-white-100 font-sans items-center flex-col justify-between h-screen">
      <div className="flex items-center flex-col pt-10">
        <h1 className="font-bold text-gray-900 text-5xl lg:text-7xl text-center ">Hi</h1>
        <h2 className={"w-2/5 p-5 items-center flex align-middle text-center min-w-[320px]"} style={{ color: "green" }}>
          This is a Vite React SSR Tailwind boilerplate my name is salih!
        </h2>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
