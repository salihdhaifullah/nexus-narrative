import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { IViews } from './../../types/profile';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function splitData(input: IViews[]): { labels: string[], count: number[] } {
    const labels: string[] = []
    const count: number[] = []

    for (let item of input) {
        labels.push(item.monthAndYear)
        count.push(item._count)
    }

    return { labels, count };
}

const ViewsChart = ({ views }: { views: IViews[] }) => {

    const [data, setData] = useState(() => {
        const { labels, count } = splitData(views);
        count.unshift(0)

        if (labels[0].slice(6) === "1") {
            labels.unshift(`${Number(labels[0].split("-")[0]) - 1}-12`)
        } else {
            labels.unshift(`${labels[0].split("-")[0]}-${Number(labels[0].split("-")[1]) - 1}`)
        }

        return {
            labels: labels,
            datasets: [{
                label: 'Views',
                data: count,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }]
        }
    })

    return (
        <Box className="h-full w-full flex justify-center items-center">
            <div className='flex overflow-x-scroll h-[500px] w-fit mx-4 bg-white shadow-lg rounded-md border  p-3 flex-col'>
                <h1 className='text-3xl text-gray-800 font-bold mb-4'>Views</h1>
                <div className="min-w-[750px] min-h-[375px] relative">
                    <Line data={data} width={750} height={375} />
                </div>
            </div>
        </Box>
    )
}

export default ViewsChart;
