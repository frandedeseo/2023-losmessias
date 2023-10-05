import Layout from '@/components/ui/Layout';
import { UserContext } from '@/context/UserContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
