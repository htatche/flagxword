import React, { useEffect, useState } from 'react';
import { DroppableBox } from './DroppableBox';
import { DragDropProvider } from "@dnd-kit/react";
import { AvailableLetters } from './AvailableLetters'
import { Generate } from './Crossword'
import type { CountryElement } from './Types';

type CellLetter = string | null;

interface BoardProps {
    boardSize: number;
}

export function Board({ boardSize }: BoardProps) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomLetters = Array.from({ length: 10 }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]!
    );
    type CellLetter = string | null;
    type Tile = { id: string; letter: string };

    const [cells, setCells] = useState<CellLetter[]>(
        () => Array(boardSize * boardSize).fill(null)
    );

    const [rack, setRack] = useState<Tile[]>(() =>
        randomLetters.map((letter, i) => ({
            id: `tile-${i}-${crypto.randomUUID()}`,
            letter: letter,
        }))
    );

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

    let result = Generate(countries, boardSize - 1);
    if (result) {
        console.table(result.board);
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;

                const targetId = String(event.operation.target?.id ?? "");
                const sourceId = String(event.operation.source?.id ?? "");

                if (!targetId.startsWith("cell-")) return;
                const cellIndex = Number(targetId.replace("cell-", ""));
                if (Number.isNaN(cellIndex)) return;

                console.log(event.operation.target);

                const tile = rack.find((t) => t.id === sourceId);
                if (!tile) return;

                // Use hooks
                setRack((prev) => prev.filter((t) => t.id !== sourceId));
                setCells((prevCells) => {
                    const newCells = [...prevCells];
                    newCells[cellIndex] = tile.letter;
                    return newCells;
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

                {cells.map((letter, i) => (
                    <DroppableBox key={i} id={`cell-${i}`}>
                        {letter ?? ""}
                    </DroppableBox>
                ))}
            </div>
        </DragDropProvider>
    );
}