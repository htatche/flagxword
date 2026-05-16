import { useEffect, useState } from 'react';
import { DroppableBox } from './DroppableBox';
import { DragDropProvider } from "@dnd-kit/react";
import { AvailableLetters } from './AvailableLetters'
import { Generate } from './Crossword'
import type { CountryElement, Cell } from './Types';

interface BoardProps {
    boardSize: number;
    countries: CountryElement[]
}

function placeFlag(
    rows: Cell[][],
    rowIndex: number,
    colIndex: number,
    country: CountryElement,
) {
    const row = rows[rowIndex];

    if (!row?.[colIndex] || !country.img) return;

    row[colIndex] = {
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
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomLetters = Array.from({ length: 10 }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]!
    );
    type Tile = { id: string; letter: string };

    const [rows, setRows] = useState<Cell[][]>([]);

    useEffect(() => {
        const result = Generate(countries, boardSize);

        if (!result) return;

        const rows: Cell[][] = result.board.map((row) => {
            return row.map((letter) => {
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

        result.positions.forEach((position) => {
            const country = countriesByCode.get(position.cca2);

            if (!country) return;

            if (position.orientation === "horizontal") {
                placeFlag(rows, position.rowIndex, position.colIndex - 1, country);
            } else {
                placeFlag(rows, position.rowIndex - 1, position.colIndex, country);
            }
        });

        setRows(rows);
    }, [boardSize, countries]);

    const [rack, setRack] = useState<Tile[]>(() =>
        randomLetters.map((letter, i) => ({
            id: `tile-${i}-${crypto.randomUUID()}`,
            letter: letter,
        }))
    );

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

                setRack((prev) => prev.filter((t) => t.id !== sourceId));
                setRows((prevRows) => {
                    const newRows = [...prevRows];
                    const row = newRows[rowIndex];

                    if (!row) return prevRows;

                    row[colIndex] = {
                        letter: tile.letter, fulfilled: true, enabled: true
                    }

                    return newRows;
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
                    rows.map((column, i) => (
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
