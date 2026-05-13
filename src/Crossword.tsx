import type { CountryElement } from './Types';

type Result = {
    ok: boolean;
    board: string[];
    nOverlaps: number;
};

const boardSize = 10;

let countries: CountryElement[] = [
    {
        name: {
            common: "CANADA"
        },
        cca2: "CA"
    },
    {
        name: {
            common: "BRAZIL"
        },
        cca2: "BR"
    },
    {
        name: {
            common: "JAPAN"
        },
        cca2: "JP"
    },
    {
        name: {
            common: "AUSTRALIA"
        },
        cca2: "AU"
    },
]

function sortWords(words: CountryElement[]): CountryElement[] {
    return words.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
    );
}

function placeFirstWord({ name: { common } }: CountryElement, board: string[][]): boolean {
    if (common.length > boardSize) {
        return false;
    }

    const middleRow = boardSize / 2;
    const startCol = Math.floor((boardSize - common.length) / 2);

    [...common].forEach((char, i) => {
        if (board[middleRow]) {
            board[middleRow][startCol + i] = char;
        };
    });

    console.log("Placed first word in the middle: " + common);

    return true;
}

export function Generate(words: CountryElement[] = countries, boardSize: number = 10) {
    const emptyCell = '#';

    const board = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => '#')
    );

    const sortedWords = sortWords(words);
    const [firstWord] = sortedWords;

    if (!firstWord) return;

    placeFirstWord(firstWord, board);

    return board;
}