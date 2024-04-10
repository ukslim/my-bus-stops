"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [ids, setIds] = useState('');
    const [current, setCurrent] = useState([] as string[]);

    useEffect(() => {
        const data = localStorage.getItem('config');
        setCurrent(data ? JSON.parse(data) : []);
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const idArray: string[] = ids.split(',').map(id => id.trim());
        const asJson = JSON.stringify(idArray);
        localStorage.setItem('config', asJson);
        setCurrent(idArray);
    };

    return (
        <div>
            <h1>Acknowledgements</h1>
            <p>We use the API from <a href="https://bustimes.org">bustimes.org</a> which themselves
            make use of public APIs they credit on their own page. Thank you everyone.</p>
            <p>Source is in <a href="https://github.com/ukslim/my-bus-stops">GitHub</a>.</p>
            <h1>Configure Bus Stops</h1>
            <p>You can find bus stop IDs on <a href="https://bustimes.org">bustimes.org</a></p>
            <p>Enter them here, comma separated and click to save.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter comma-separated IDs:
                    <input type="text" value={ids} onChange={(e) => setIds(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <h3>Current configuration:</h3>
            <pre>{current.join(', ')}</pre>
            <Link href="/">Back home</Link>
        </div>
    );
}