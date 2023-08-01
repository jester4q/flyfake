import { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetchData';

const useOnFetch = function <T>(path: string) {
    const [abortFetchCtrl, setAbortFetchCtrl] = useState<AbortController | null>(null);
    const [data, setData] = useState<T[]>([]);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        // fetch data
        const dataFetch = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            setAbortFetchCtrl(controller);
            setStatus('fetching');
            try {
                const data = await fetchData<T[]>(path, signal);
                setData(data);
                setStatus('fetched');
            } catch (e) {
                // dumme
                setStatus('failed');
            }
        };
        if (abortFetchCtrl) {
            abortFetchCtrl.abort();
        }
        if (path) {
            dataFetch();
        } else {
            setData([]);
        }

        return () => {
            if (abortFetchCtrl) {
                abortFetchCtrl.abort();
            }
        };
    }, [path]);

    return { status, data };
};

export default useOnFetch;
