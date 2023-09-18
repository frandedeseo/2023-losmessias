import * as React from 'react';
import TeachersTable from './components/TeachersTable';
import Searchbar from './components/Searchbar';

const data = [
    { name: 'Francisco de Deseo', subjects: ['Physics', 'Math'] },
    { name: 'Gonzalo Hernandez', subjects: ['History'] },
    { name: 'Augusto Ramseyer', subjects: ['Informatic'] },
];

export default function Validator() {
    return (
        <div style={{ margin: '2% 5%' }}>
            <Searchbar />
            <div style={{ paddingBlock: '0.5rem' }} />
            <TeachersTable teachers={data} />
        </div>
    );
}
