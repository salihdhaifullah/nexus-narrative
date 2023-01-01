import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);


interface IViews {
    _count: number;
    monthAndYear: string
}

const serverData: IViews[] = [
    { _count: 2231, monthAndYear: "2022-11" },
    { _count: 23233, monthAndYear: "2022-12" },
    { _count: 445, monthAndYear: "2023-1" },
    { _count: 34453, monthAndYear: "2023-2" },
    { _count: 53243, monthAndYear: "2023-3" },
    { _count: 41202, monthAndYear: "2023-4" },
    { _count: 8023, monthAndYear: "2023-5" },
    { _count: 5322, monthAndYear: "2023-6" },
    { _count: 2324, monthAndYear: "2023-7" },
    { _count: 7223, monthAndYear: "2023-8" },
    { _count: 22323, monthAndYear: "2023-9" },
    { _count: 2112, monthAndYear: "2023-10" },
    { _count: 9896, monthAndYear: "2023-11" },
    { _count: 8575, monthAndYear: "2023-12" },
    { _count: 3234, monthAndYear: "2024-1" },
    { _count: 87650, monthAndYear: "2024-2" }
]

function splitData(input: IViews[]): { labels: string[], count: number[] } {
    const labels: string[] = []
    const count: number[] = []

    for (let item of input) {
        labels.push(item.monthAndYear)
        count.push(item._count)
    }

    return { labels, count };
}

const { labels, count } = splitData(serverData);

export const data = {
    labels: labels,
    datasets: [{
        label: 'Views',
        data: count,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }]
};

const ViewsChart = () => {
    return (
        <div className='flex  flex-col justify-center items-center'>
            <div className="overflow-auto">
            <Line className="h-[400px] bg-white shadow-lg rounded-md border w-auto" options={{ responsive: true }} data={data} />
            </div>
        </div>
    )
}

export default ViewsChart;
