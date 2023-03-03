import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import { useEffect, useCallback } from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
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
        <Box className="h-full mx-4 overflow-x-auto">
            <h1 className='text-3xl text-gray-800 font-bold mb-4 '>Views</h1>

            <div className='flex min-h-[500px] min-w-[900px] w-fit h-full shadow-lg rounded-md border bg-white p-3 flex-col justify-center items-center'>
                <Line className="overflow-x-auto" data={data} />
            </div>
        </Box>
    )
}

export default ViewsChart;
