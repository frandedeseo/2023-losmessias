import dynamic from 'next/dynamic';
const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie), { ssr: false });
import { Typography } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import { getColor } from '@/utils/getColor';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';

export default function MonthlyChart({ id, legend = false }) {
    const user = useUser();
    const [data, setData] = useState([]);
    const [configDonut, setConfigDonut] = useState(null);

    useEffect(() => {
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/getStatistics?professorId=${id}`, requestOptions).then(res => {
                res.json().then(json => {
                    const newData = json.map(e => {
                        let classes = Object.keys(e.classesPerSubject).map(key => ({ type: key, value: e.classesPerSubject[key] }));
                        return {
                            total: e.totalClasses,
                            income: e.incomes,
                            classes,
                        };
                    });
                    setData(newData);
                });
            });
        }
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const colors = data[0]?.classes.map(val => {
                if (val.type !== 'Cancelled') return getColor(val.type);

                return '#ADB5BD';
            });
            setConfigDonut({
                appendPadding: 10,
                data: data[2].classes,
                angleField: 'value',
                colorField: 'type',
                radius: 1,
                innerRadius: 0.55,
                legend: {
                    legend: true,
                    position: 'right',
                },
                color: colors,
                label: {
                    type: 'inner',
                    offset: '-50%',
                    content: '{percentage}',
                    style: {
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        fill: 'black',
                    },
                },
                interactions: [
                    {
                        type: 'element-selected',
                    },
                    {
                        type: 'element-active',
                    },
                ],
                statistic: {
                    title: false,
                    content: {
                        customHtml: () => <Typography variant='h4'>{data[2].total}</Typography>,
                        style: {
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    },
                },
            });
        }
    }, [data]);

    return (
        <>
            {configDonut && (
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    <Pie {...configDonut} />
                </div>
            )}

            <Typography variant='h5' sx={{ marginBottom: '0.5rem', marginTop: '-1rem', textAlign: 'center' }}>
                Income
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <PaidIcon sx={{ fontSize: 30 }} />
                <Typography variant='h6'>{data[2]?.income}</Typography>
            </div>
        </>
    );
}
