import { useEffect } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { useTheme } from '../../../context/theme';
import { Link } from 'react-router-dom';
import hljs from 'highlight.js';
import dark from "highlight.js/styles/atom-one-dark.min.css?url";
import light from 'highlight.js/styles/atom-one-light.min.css?url';

import remarkGfm from 'remark-gfm';

export default function useMarkdown(md: string): JSX.Element {
  const theme = useTheme();

  useEffect(() => {
    const link = document.createElement('link');
    const css = theme === "dark" ? dark : light;

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = css;

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [theme])

  const markdownComponents: Components = {
    h1: ({ children }) => {
      return <h1 className='my-2 text-4xl dark:text-white'>{children}</h1>
    },
    h2: ({ children }) => {
      return <h2 className='my-2 text-3xl dark:text-white'>{children}</h2>
    },
    h3: ({ children }) => {
      return <h3 className='my-2 text-2xl dark:text-white'>{children}</h3>
    },
    h4: ({ children }) => {
      return <h4 className='my-2 text-xl dark:text-white'>{children}</h4>
    },
    h5: ({ children }) => {
      return <h5 className='my-2 text-lg dark:text-white'>{children}</h5>
    },
    h6: ({ children }) => {
      return <h6 className='my-2 text-base dark:text-white'>{children}</h6>
    },

    p: ({ children }) => {
      return <p className='text-base text-gray-800 dark:text-gray-200 my-1'>{children}</p>
    },

    ul: ({ children }) => {
      return <ul className='pl-5 dark:text-white list-disc'>{children}</ul>
    },

    ol: ({ children }) => {
      return <ol className='pl-5 dark:text-white list-decimal'>{children}</ol>
    },

    blockquote: ({ children }) => {
      return <blockquote className='bg-slate-100 dark:bg-slate-900 rounded-sm dark:border-l-gray-600 border-l-gray-400 border-l-4 my-4 p-2'>{children}</blockquote>
    },

    strong: ({children}) => {
      return <strong className='font-extrabold text-[1.05em]'>{children}</strong>
    },

    table: ({ children }) => {
      return <table className='flex dark:bg-black bg-white dark:border-gray-800 my-2 rounded-md p-1 shadow-md w-fit border flex-col'>{children}</table>
    },

    tbody: ({ children }) => {
      return <tbody className='gap-1 border-t dark:border-gray-600 flex flex-col w-fit'>{children}</tbody>
    },

    tr: ({ children }) => {
      return <tr className='gap-1 flex p-1 flex-row'>{children}</tr>
    },

    td: ({ children }) => {
      return <td className='gap-1 min-w-[4rem] dark:text-gray-100 dark:border-gray-800 text-center w-auto bg-slate-100 dark:bg-slate-900 border flex p-1 flex-col'>{children}</td>
    },

    thead: ({ children }) => {
      return <thead className='gap-1 flex py-1 flex-col w-fit dark:text-white'>{children}</thead>
    },

    hr: () => {
      return <hr className='my-8 h-0.5 px-2 w-full dark:bg-gray-100 bg-gray-900' />
    },

    th: ({ children }) => {
      return <th className='gap-1 min-w-[4rem] text-center w-auto dark:text-white dark:border-gray-800 bg-slate-100 dark:bg-slate-900 border flex p-1 flex-col'>{children}</th>
    },

    img: ({ children, src, alt }) => {
      return <img src={src?.startsWith("/blob:") ? src?.slice(1) : src} alt={alt} className='my-6 max-w-[400px] max-h-[400px] mr-auto object-cover border border-slate-100 dark:border-slate-900 overflow-x-auto'>{children}</img>
    },

    a: ({ href, children }) => {
      if (href && href.startsWith('/')) {
        return <Link className='link' to={href}>{children}</Link>;
      }
      return <a className='link' target="_blank" rel="noreferrer" href={href}>{children}</a>;
    },

    pre: ({ children }) => {
      return <pre className="hljs overflow-x-auto w-full flex p-2 rounded-md shadow-md my-4">{children}</pre>
    },

    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match && match[1] && hljs.getLanguage(match[1])) {

        try {
          const highlightedCode = hljs.highlight(String(children).replace(/\n$/, ''), { language: match[1] }).value;

          return <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />

        } catch (err) {
          console.error('Error highlighting code:', err);
        }

      }

      return <code className='bg-slate-300 dark:bg-slate-700 px-2 py-1 m-1 rounded-md'>{children}</code>
    },
  };

  return <ReactMarkdown className="overflow-x-auto thin-scrollbar" remarkPlugins={[remarkGfm]} components={markdownComponents}>{md}</ReactMarkdown>;
}
