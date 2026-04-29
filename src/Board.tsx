import {DroppableBox} from './DroppableBox';

type CellLetter = string | null;

interface BoardProps {
    size: number;
    cells: CellLetter[];
}

export function Board({size, cells}: BoardProps) {
    return (
        <div
            className="board"
            style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            }}
        >

            {cells.map((letter, i) => (
                <DroppableBox key={i} id={`cell-${i}`}>
                    {letter ?? ""}
                </DroppableBox>
            ))}
        </div>
    );
}