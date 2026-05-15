import React, { useEffect, useState } from 'react';

import { Board } from './Board'
import { RestCountriesApi } from "./RestCountriesApi";

export function App() {
    const [countries, setCountries] = useState<Record<string, string>>({ "and": "Andorra" });

    async function fetchCountries() {
        let countries = await RestCountriesApi.list();

        setCountries(countries);
    }

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        console.log(countries);
    }, [countries]);

    return (
        <main className="app-shell">
            <Board boardSize={10} />
        </main>
    )
}
