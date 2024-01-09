import { useHead } from "../HeadContext";
import ReactDOMServer from "react-dom/server";

const Head = () => {
  return (
    <>
      <title>hello world from about</title>
      <meta name="description" content="description for about page" />
    </>
  )
}

const useSetHead = (Head: () => JSX.Element) => {
  const head = useHead()
  head.head = Head
  if (typeof window !== "undefined") {
    document.getElementsByTagName("head")[0].innerHTML.replace("<!-- app head -->", ReactDOMServer.renderToString(<Head />))
    console.log("it runs on client")
  }
}

function About() {
  useSetHead(Head)

  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default About;
