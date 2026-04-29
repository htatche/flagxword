import {useDraggable} from '@dnd-kit/react';

interface DraggableLetterProps {
    id: string;
    letter: string;
}

export function DraggableLetter({ id, letter }: DraggableLetterProps) {
    const {ref} = useDraggable({
        id,
    });

    return (
        <button ref={ref}>
            {letter}
        </button>
    );
}
