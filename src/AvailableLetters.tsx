import {DraggableLetter} from './DraggableLetter';

type Tile = { id: string; letter: string };
type RackSlot = Tile | null;

interface AvailableLettersProps {
    letters: RackSlot[];
}

export function AvailableLetters({letters}: AvailableLettersProps) {
    return (
        <div
            className="draggable-letters"
            style={{
                gridTemplateColumns: `repeat(5, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(2, minmax(0, 1fr))`,
            }}
        >
            {letters.map((letter, index) => {
                if (!letter) {
                    return <div key={`empty-${index}`} className="rack-placeholder" />;
                }

                return (
                    <DraggableLetter
                        key={letter.id}
                        id={letter.id}
                        letter={letter.letter}
                    />
                );
            })}
        </div>
    );
}
