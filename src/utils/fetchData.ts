export async function fetchData<T>(path: string, signal?: any): Promise<T> {
    const url = 'http://31.172.71.73/api' + path;
    //const url = 'http://localhost:3000/api' + path;
    return (await fetch(url, { method: 'get', signal: signal })).json();
}
