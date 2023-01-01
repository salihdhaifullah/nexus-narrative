import ViewsChart from '../../components/ViewsChart'
import Posts from '../../components/Posts'
import Profile from '../../components/Profile'

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-[120px] my-10">
        <Profile />
        <ViewsChart />
        <Posts />
    </div>
  )
}

export default Dashboard;
