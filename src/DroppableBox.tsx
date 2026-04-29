import {useDroppable} from '@dnd-kit/react';
import type {ReactNode} from 'react';

interface DroppableProps {
    id: string;
    children: ReactNode;
}

export function DroppableBox({id, children}: DroppableProps) {
    const {ref} = useDroppable({
        id,
    });

    return (
        <div ref={ref} className="droppable-box">
            <span className="cell-letter">{children}</span>
        </div>
    );
}
