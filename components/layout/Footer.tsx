import Link from "next/link";

const Footer = () => {
    return (
        <div className="flex flex-col min-h-[50px] mt-10 w-full ">
            <p className="text-center text-secondary">
                {'Copyright © '}
                <Link href="https://github.com/salehWeb">
                    Builded And developed by salehWeb
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </p>
        </div>
    );
};

export default Footer;
