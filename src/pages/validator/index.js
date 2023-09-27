// components
import TeachersTable from './components/TeachersTable';
import Searchbar from './components/Searchbar';

// styles
import { styles } from './styles.js';

export async function getServerSideProps() {
    const res = await fetch('http://localhost:8080/api/professor-subject/findByStatus?status=PENDING');
    const data = await res.json();
    return { props: { data } };
}

export default function Validator({ data }) {
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
            <TeachersTable data={data} />
        </div>
    );
}
