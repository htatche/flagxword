import React, { useEffect, useState } from 'react';

import { Board } from './Board'
import { RestCountriesApi } from "./RestCountriesApi";
import type { CountryElement } from './Types';

export function App() {
    const [countries, setCountries] = useState<CountryElement[]>([]);
    const [boardSize, setBoardSize] = useState<number>(10);

    useEffect(() => {
        async function fetchCountries() {
            const list = await RestCountriesApi.list();

            if (list.length === 0) return;

            const countriesSet: CountryElement[] = [];

            while (countriesSet.length < 5) {
                const country = list[Math.floor(Math.random() * list.length)]!;

                if (!countriesSet.includes(country)) {
                    countriesSet.push(country);
                }
            }

            countriesSet.map((country) => {
                country.name.common = country.name.common.toUpperCase();

                return country;
            })

            const longestCountryName = countriesSet.reduce((longest, current) =>
                current.name.common.length > longest.name.common.length ? current : longest
            );

            setCountries(countriesSet);
            setBoardSize(Math.max(10, longestCountryName.name.common.length + 2));
        }

        fetchCountries();
    }, []);

    return (
        <main className="app-shell">
            {countries.length > 0 && <Board boardSize={boardSize} countries={countries} />}
        </main>
    )
}
