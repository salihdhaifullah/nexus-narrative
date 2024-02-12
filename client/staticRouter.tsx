import { Props } from './src'
import App from './src/pages/App'
import Login from './src/pages/Login'

const routes = {
    "/": App,
    "/login": Login
}

const StaticRouter = (url: string, props: Props<unknown>) => {
// @ts-ignore
  const Page = routes[url]
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

export default StaticRouter
