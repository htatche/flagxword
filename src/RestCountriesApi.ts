import type { CountryElement } from './Types';
import { COUNTRIES } from './Countries';

export namespace RestCountriesApi {
  const URL = "https://restcountries.com/v3.1/all?fields=name,cca2";

  async function getData(): Promise<CountryElement[]> {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return response.json();
  }

  export async function list() {
    const data = COUNTRIES; // await getData();

    return data;
  }
}
