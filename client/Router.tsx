import { Props } from './src'

const routes = {
    "/": import("./src/pages/App"),
    "/login": import("./src/pages/Login")
}

const Router = async (url: string, props: Props<unknown>) => {
  // @ts-ignore
  const Page = (await routes[url]).default
  return (
    <div>
        {Page ? <Page {...props}/> : (
            <h1>
                Not Found
            </h1>
        )}
    </div>
  )
}

export default Router
