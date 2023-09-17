// components
import TeachersTable from './components/TeachersTable';
import Searchbar from './components/Searchbar';

// styles
import { styles } from './styles.js';

const data = [
    { id: 0, name: 'Francisco de Deseo', subjects: ['Physics', 'Math'] },
    { id: 1, name: 'Gonzalo Hernandez', subjects: ['History'] },
    { id: 2, name: 'Augusto Ramseyer', subjects: ['Informatic'] },
    { id: 3, name: 'Francisco de Deseo', subjects: ['Physics', 'Math'] },
    { id: 4, name: 'Gonzalo Hernandez', subjects: ['History'] },
    { id: 5, name: 'Augusto Ramseyer', subjects: ['Informatic'] },
    { id: 6, name: 'Francisco de Deseo', subjects: ['Physics', 'Math'] },
    { id: 7, name: 'Gonzalo Hernandez', subjects: ['History'] },
    { id: 8, name: 'Augusto Ramseyer', subjects: ['Informatic'] },
    { id: 9, name: 'Francisco de Deseo', subjects: ['Physics', 'Math'] },
    { id: 10, name: 'Santiago Hernandez', subjects: ['Music'] },
    { id: 11, name: 'Fabiana Paluci', subjects: ['Economics'] },
];

export default function Validator() {
    const handleSearch = value => {
        console.log('Search must be done!');
        console.log('value: ' + value);
    };

    const handleFilter = subjects => {
        console.log('Filter must be done!');
        console.log(subjects);
    };

    return (
        <div style={styles.container}>
            <Searchbar search={handleSearch} filter={handleFilter} />
            <div style={styles.divPadding} />
            <TeachersTable teachers={data} />
        </div>
    );
}
