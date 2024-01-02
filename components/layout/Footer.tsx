import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex flex-col h-12 justify-center items-center w-full">
            <p className="text-center text-secondary">
                {'Copyright © '}
                <Link href="/" className="link">NexusNarrative</Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </p>
        </footer>
    );
};

export default Footer;
