import { useEffect, useState } from 'react';
import { DroppableBox } from './DroppableBox';
import { DragDropProvider } from "@dnd-kit/react";
import { AvailableLetters } from './AvailableLetters'
import { Generate } from './Crossword'
import type { ResultBoard } from './Crossword'
import type { CountryElement, Cell } from './Types';

interface BoardProps {
    boardSize: number;
    countries: CountryElement[]
}

function placeFlag(
    board: Cell[][],
    rowIndex: number,
    colIndex: number,
    country: CountryElement,
) {
    const columns = board[rowIndex];

    if (!columns?.[colIndex] || !country.img) return;

    columns[colIndex] = {
        letter: "",
        img: {
            src: country.img,
            alt: `${country.name.common} flag`,
        },
        fulfilled: true,
        enabled: true,
    };
}

export function Board({ boardSize, countries }: BoardProps) {
    type Tile = { id: string; letter: string }; 1

    const [board, setBoard] = useState<Cell[][]>([]);
    const [rack, setRack] = useState<Tile[]>([]);
    const [generatedCrossword, setGeneratedCrossword] = useState<ResultBoard | false>();

    function generateBoard() {
        const crossword = Generate(countries, boardSize);

        if (!crossword) return;

        const board: Cell[][] = crossword.board.map((columns) => {
            return columns.map((letter) => {
                if (letter == "#") {
                    return { letter: letter, fulfilled: false, enabled: false };
                } else {
                    return { letter: letter, fulfilled: false, enabled: true };
                }
            })
        })

        const countriesByCode = new Map(
            countries.map((country) => [country.cca2, country])
        );

        crossword.positions.forEach((position) => {
            const country = countriesByCode.get(position.cca2);

            if (!country) return;

            if (position.orientation === "horizontal") {
                placeFlag(board, position.rowIndex, position.colIndex - 1, country);
            } else {
                placeFlag(board, position.rowIndex - 1, position.colIndex, country);
            }
        });

        setBoard(board);
        setGeneratedCrossword(crossword);
    }

    function shuffle<T>(arr: T[]): T[] {
        const copy = [...arr]

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [copy[i], copy[j]] = [copy[j]!, copy[i]!]
        }

        return copy
    }

    function setupAvailableLetters() {
        if (!generatedCrossword) return;
        if (countries.length === 0) return;

        const availableCountries = countries.filter((country) => {
            return generatedCrossword.positions.find((position) => {
                return position.cca2 == country.cca2
            });
        });
        const allLetters = availableCountries.reduce<string[]>((allLetters, country) => {
            allLetters.push(...country.name.common.split(""));

            return allLetters;
        }, []);
        const randomLetters = shuffle(allLetters);

        const rack = randomLetters.map((letter, i) => ({
            id: `tile-${i}-${crypto.randomUUID()}`,
            letter: letter,
        }))

        setRack(rack);
    }

    useEffect(() => {
        setupAvailableLetters();
    }, [generatedCrossword, countries]);

    useEffect(() => {
        generateBoard();
    }, [boardSize, countries]); // TOIDO remove boarsize?

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;

                const targetId = String(event.operation.target?.id ?? "");
                const sourceId = String(event.operation.source?.id ?? "");

                const [, rowIndexText, colIndexText] = targetId.split("-");
                const rowIndex = Number(rowIndexText);
                const colIndex = Number(colIndexText);

                if (Number.isNaN(rowIndex) || Number.isNaN(colIndex)) return;

                const tile = rack.find((t) => t.id === sourceId);
                if (!tile) return;

                setBoard((prevBoard) => {
                    const newBoard = [...prevBoard];
                    const columns = newBoard[rowIndex];

                    if (!columns?.[colIndex]) return prevBoard;

                    if (tile.letter != columns[colIndex].letter) return prevBoard;

                    columns[colIndex] = {
                        letter: tile.letter, fulfilled: true, enabled: true
                    }

                    setRack((prev) => prev.filter((t) => t.id !== sourceId));

                    return newBoard;
                });
            }}
        >

            <AvailableLetters letters={rack} />

            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
                }}
            >

                {
                    board.map((column, i) => (
                        column.map((cell, j) => (
                            <DroppableBox
                                key={`${i}-${j}`}
                                id={`cell-${i}-${j}`}
                                enabled={cell.enabled}
                                fulfilled={cell.fulfilled}
                                flag={cell.img}
                            >
                                {cell.letter}
                            </DroppableBox>
                        ))
                    ))
                }
            </div>
        </DragDropProvider>
    );
}
