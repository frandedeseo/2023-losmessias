import { Pie } from '@ant-design/charts';
import { Card, Typography } from '@mui/material';

const mockData = {
    monthlyMean: {
        totalClasses: 22,
        classesPerSubject: {
            math: 12,
            biology: 8,
        },
        incomes: 1000,
        cancelledClasses: 2,
    },
    currentMonth: {
        totalClasses: 15,
        classesPerSubject: {
            math: 10,
            biology: 5,
        },
        incomes: 700,
        cancelledClasses: 0,
    },
    prevMonth: {
        totalClasses: 25,
        classesPerSubject: {
            math: 15,
            biology: 10,
        },
        incomes: 1200,
        cancelledClasses: 0,
    },
};

export default function Dashboard({ id }) {
    const data = [
        { type: 'Math', value: 12 },
        {
            type: 'Biology',
            value: 8,
        },
        {
            type: 'Cancelled',
            value: 2,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        legend: {
            position: 'bottom',
        },
        label: {
            content: '{percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const configDonut = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
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
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: '22',
            },
        },
    };

    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Card sx={{ width: '65%', justifyContent: 'space-between' }}>
                <Typography>Current Month</Typography>
                <Pie {...config} style={{ width: '70%' }} />

                <Typography>Total: 22</Typography>
                <Typography>Income: $1000</Typography>
            </Card>
            <Card style={{ width: '40%', textAlign: 'center' }}>
                <Typography>Montly Mean</Typography>
                <Pie {...configDonut} />
                <Typography>Income: $1000</Typography>
            </Card>
        </div>
    );
}
