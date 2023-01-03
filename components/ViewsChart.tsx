import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import { GetViewsChart } from '../api';
import { useEffect, useCallback } from 'react';
import { useState } from 'react';

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

function splitData(input: IViews[]): { labels: string[], count: number[] } {
    const labels: string[] = []
    const count: number[] = []

    for (let item of input) {
        labels.push(item.monthAndYear)
        count.push(item._count)
    }

    return { labels, count };
}

const ViewsChart = () => {
    const [data, setData] = useState({
        labels: ["2022-11", "2022-12", "2022-1"],
        datasets: [{
            label: 'Views',
            data: [3223, 3223, 2323],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)'
        }]
    })

    const init = useCallback(async () => {
        await GetViewsChart()
            .then((res) => {
                const { labels, count } = splitData(res.data.data);
                count.unshift(0)
                labels.unshift(`${labels[0].split("-")[0]}-${Number(labels[0].split("-")[1]) - 1}`)
                setData({
                    labels: labels,
                    datasets: [{
                        label: 'Views',
                        data: count,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)'
                    }]
                })
            })
            .catch((err) => { console.log(err) })
    }, [])

    useEffect(() => {
        init()
    }, [init])

    return (
        <Box className="h-full mx-4 overflow-x-auto">
            <h1 className='text-3xl text-gray-800 font-bold mb-4'>Views</h1>

            <div className='flex min-h-[500px] min-w-[900px] w-fit h-full shadow-lg rounded-md border bg-white p-3 flex-col justify-center items-center'>
                <Line className="overflow-x-auto" data={data} />
            </div>
        </Box>
    )
}

export default ViewsChart;
