import type { CountryElement } from './Types';

type Result = {
    ok: boolean;
    board: string[][];
    nOverlaps: number;
};

type Orientation = "horizontal" | "vertical";

type ResultWithPosition = { ok: false }
    | Result & {
        startRowIndex: number;
        startColIndex: number;
        orientation: Orientation;
    }

type Position =
    {
        cca2: string,
        rowIndex: number,
        colIndex: number,
        orientation: Orientation
    }

type ResultBoard = {
    board: string[][],
    positions: Position[]
}

const RESERVED_BORDER = 0; // Reserved for flags TODO: FIX 

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

function placeFirstWord({ name: { common } }: CountryElement, board: string[][]): ResultWithPosition {
    if (common.length > board.length - RESERVED_BORDER * 2) {
        console.log("Word is too long");
        return { ok: false };
    }

    const middleRow = Math.floor(board.length / 2);
    const startCol = RESERVED_BORDER + Math.floor((board.length - RESERVED_BORDER * 2 - common.length) / 2);

    [...common].forEach((char, i) => {
        if (board[middleRow]) {
            board[middleRow][startCol + i] = char;
        };
    });

    console.log("Placed first word in the middle: " + common);

    return { ok: true, board, startRowIndex: middleRow, startColIndex: startCol, orientation: "horizontal", nOverlaps: 0 };
}

function placeWord({ name: { common } }: CountryElement, board: string[][]): ResultWithPosition {
    if (common.length > board.length - RESERVED_BORDER * 2) {
        console.log("Word is too long");
        return { ok: false };
    }

    const maxStart = board.length - common.length - RESERVED_BORDER;
    let bestOverlap = 0;
    let bestBoard: string[][];
    let placementFound = false;

    let startRowIndex = 0;
    let startColIndex = 0;
    let orientation: Orientation = "horizontal";

    for (let rowIndex = RESERVED_BORDER; rowIndex < board.length - RESERVED_BORDER; rowIndex++) {
        for (let colIndex = RESERVED_BORDER; colIndex <= maxStart; colIndex++) {
            const result: Result = checkHorizontal(rowIndex, colIndex, board.map(row => [...row]), common);

            if (isPlacementFound(result, bestOverlap)) {
                bestOverlap = result.nOverlaps;
                bestBoard = result.board;
                startRowIndex = rowIndex;
                startColIndex = colIndex;
                orientation = "horizontal";
                placementFound = true;
            }
        }
    }

    for (let rowIndex = RESERVED_BORDER; rowIndex <= maxStart; rowIndex++) {
        for (let colIndex = RESERVED_BORDER; colIndex < board.length - RESERVED_BORDER; colIndex++) {
            const result: Result = checkVertical(rowIndex, colIndex, board.map(row => [...row]), common);

            if (isPlacementFound(result, bestOverlap)) {
                bestOverlap = result.nOverlaps;
                bestBoard = result.board;
                startRowIndex = rowIndex;
                startColIndex = colIndex;
                orientation = "vertical";
                placementFound = true;
            }
        }
    }

    return { ok: placementFound, board: bestBoard!, startRowIndex, startColIndex, orientation, nOverlaps: bestOverlap };
}

export function Generate(words: CountryElement[], boardSize: number): ResultBoard | false {
    const emptyCell = '#';
    let board: string[][] = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => emptyCell)
    );
    const positions: Position[] = [];
    const sortedWords = sortWords(words);
    const [firstWord] = sortedWords;

    if (!firstWord) return false;

    const firstPlacement = placeFirstWord(firstWord, board);

    if (!firstPlacement.ok) return false;

    positions.push({
        cca2: firstWord.cca2,
        rowIndex: firstPlacement.startRowIndex,
        colIndex: firstPlacement.startColIndex,
        orientation: firstPlacement.orientation
    });

    let nPlacedWords = 1; // TODO Unused, for debug purposes

    sortedWords.slice(nPlacedWords).forEach((word) => {
        const result = placeWord(word, board);

        if (result.ok) {
            board = result.board;
            
            nPlacedWords++;
            positions.push(
                {
                    cca2: word.cca2,
                    rowIndex: result.startRowIndex,
                    colIndex: result.startColIndex,
                    orientation: result.orientation
                }
            )

            console.log("Placed word " + word.name.common + " with overlap " + result.nOverlaps);

        } else {
            console.log("Could not place " + word.name.common + " because it had no valid overlap.");
        }
    })

    return {
        board,
        positions
    };
}
