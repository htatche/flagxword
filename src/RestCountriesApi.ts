/**
 * It looks at a list
 * https://restcountries.com/v3.1/all?fields=name,flags
 *  pulls 14 random countries
 *  fits them in randomly (take care of overlapping)
 *  fills in missing squares with black
 */

import type { CountryElement } from './Types';

const MAX_COUNTRY_NAME_LENGTH = 25;

export namespace RestCountriesApi {
  const URL = "https://restcountries.com/v3.1/all?fields=name,cca2";

  async function getData(): Promise<CountryElement[]> {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return response.json();
  }

  function transformData(acc: Record<string, string>, item: CountryElement) {
    // Keep only countries with shorter names
    if (item["name"]["common"].length <= MAX_COUNTRY_NAME_LENGTH) {
      acc[item["cca2"]] = item["name"]["common"];
    }

    return acc;
  }

  function getRandomCountries() {
    /* 
    
      Find overlapping words and chuck them into Array of Arrays
      [[andorra, ], [], []]

    */ 
  }

  export async function list() {
    const data = await getData();

    return data.reduce(transformData, {} as Record<string, string>);
  }
}
