import type { CountryElement } from './Types';

type Result = {
    ok: boolean;
    board: string[][];
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

function inBounds(rowIndex: number, colIndex: number, boardSize: number): boolean {
    return rowIndex >= 0 && rowIndex < boardSize && colIndex >= 0 && colIndex < boardSize;
}

function isEmpty(rowIndex: number, colIndex: number, board: string[][]): boolean {
    return !inBounds(rowIndex, colIndex, board.length) || board[rowIndex]![colIndex] == '#';
}

function sortWords(words: CountryElement[]): CountryElement[] {
    return words.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
    );
}

function isPlacementFound(result: Result, bestOverlap: number): boolean {
    return result.ok && result.nOverlaps > 0 && result.nOverlaps > bestOverlap;
}

function checkHorizontal(rowIndex: number, colIndex: number, board: string[][], word: string): Result {
    let nOverlaps = 0;

    // Cell to left and to the right of the word must be empty to space out words
    // e.g. "SATURNPLUTO" is an invalid placement
    if (!isEmpty(rowIndex, colIndex - 1, board) || !isEmpty(rowIndex, colIndex + word.length, board)) {
        return { ok: false, board, nOverlaps: 0 };
    }

    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
        const cell = board[rowIndex]![colIndex + letterIndex];

        if (cell == '#') {
            // Newly placed horizontal letters must not touch letters above/below
            // e.g. "SATURN"
            //      "PLUTO" is an invalid placement
            if (!isEmpty(rowIndex - 1, colIndex + letterIndex, board)) return { ok: false, board, nOverlaps: 0 };
            if (!isEmpty(rowIndex + 1, colIndex + letterIndex, board)) return { ok: false, board, nOverlaps: 0 };

            board[rowIndex]![colIndex + letterIndex] = word[letterIndex]!;
        } else if (cell == word[letterIndex]) {
            nOverlaps++;
        } else {
            return { ok: false, board, nOverlaps: 0 };
        }
    }

    return { ok: true, board, nOverlaps };
}

function checkVertical(rowIndex: number, colIndex: number, board: string[][], word: string): Result {
    let nOverlaps = 0;

    // Cell above and below of the word must be empty to space out words
    if (!isEmpty(rowIndex - 1, colIndex, board) || !isEmpty(rowIndex + word.length, colIndex, board)) {
        return { ok: false, board, nOverlaps: 0 };
    }

    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
        const cell = board[rowIndex + letterIndex]![colIndex];

        if (cell == '#') {
            // Newly placed vertical letters must not touch letters left/right
            if (!isEmpty(rowIndex + letterIndex, colIndex - 1, board)) return { ok: false, board, nOverlaps: 0 };
            if (!isEmpty(rowIndex + letterIndex, colIndex + 1, board)) return { ok: false, board, nOverlaps: 0 };

            board[rowIndex + letterIndex]![colIndex] = word[letterIndex]!;
        } else if (cell == word[letterIndex]) {
            nOverlaps++;
        } else {
            return { ok: false, board, nOverlaps: 0 };
        }
    }

    return { ok: true, board, nOverlaps };
}

function placeFirstWord({ name: { common } }: CountryElement, board: string[][]): boolean {
    if (common.length > boardSize) {
        console.log("Word is too long");
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

function placeWord({ name: { common } }: CountryElement, board: string[][], nPlacedWords: number): Result {
    if (common.length > boardSize) {
        console.log("Word is too long");
        return { ok: false, board, nOverlaps: 0 };
    }

    const maxStart = boardSize - common.length;
    let bestOverlap = -1 // TODO Why -1
    let bestBoard: string[][];
    let placementFound = false;

    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 0; colIndex <= maxStart; colIndex++) {
            const row = board[rowIndex]!;

            let result: Result = checkHorizontal(rowIndex, colIndex, board.map(row => [...row]), common);

            if (isPlacementFound(result, bestOverlap)) {
                bestOverlap = result.nOverlaps;
                bestBoard = result.board;
                placementFound = true;
            }

        }
    }

    for (let rowIndex = 0; rowIndex <= maxStart; rowIndex++) {
        for (let colIndex = 0; colIndex < board.length; colIndex++) {
            const row = board[rowIndex]!;

            let result: Result = checkVertical(rowIndex, colIndex, board.map(row => [...row]), common);

            if (isPlacementFound(result, bestOverlap)) {
                bestOverlap = result.nOverlaps;
                bestBoard = result.board;
                placementFound = true;
            }

        }
    }

    if (placementFound) {
        return { ok: true, board: bestBoard!, nOverlaps: bestOverlap };

    } else {
        return { ok: false, board: bestBoard!, nOverlaps: bestOverlap };

    }
}

export function Generate(words: CountryElement[] = countries, boardSize: number = 10) {
    const emptyCell = '#';
    let board = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => emptyCell)
    );

    const sortedWords = sortWords(words);
    const [firstWord] = sortedWords;

    if (!firstWord) return;

    placeFirstWord(firstWord, board);

    let nPlacedWords = 1;

    words.slice(nPlacedWords).forEach((word) => {
        let result = placeWord(word, board, nPlacedWords);

        if (result.ok) {
            board = result.board;
            nPlacedWords++;

            console.log("Placed word " + word.name.common + " with overlap " + result.nOverlaps);

        } else {
            console.log("Could not place " + word.name.common + " because it had no valid overlap.");
        }
    })

    return board;
}