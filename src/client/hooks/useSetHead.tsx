import { ReactElement, useEffect } from "react";
import { useHead } from "../HeadContext";
import ReactDOMServer from "react-dom/server";

const useSetHead = (Head: ReactElement) => {
  const head = useHead();
  head.head = Head;

  useEffect(() => {
      if (!head.head) return;

      const headHtml = ReactDOMServer.renderToString(head.head);
      const startTag = "<!-- head-start -->";
      const endTag = "<!-- head-end -->";

      const pattern = new RegExp(`${startTag}(.*?)${endTag}`);
      document.head.innerHTML = document.head.innerHTML.replace(pattern, `${startTag}${headHtml}${endTag}`);

      return () => { document.head.innerHTML = document.head.innerHTML.replace(pattern, `${startTag}${endTag}`) }
    }, [])
};


export default useSetHead;
