import { useDroppable } from '@dnd-kit/react';
import type { ReactNode } from 'react';

interface DroppableProps { // TODO Merge w/ Cell 
    id: string;
    enabled: boolean,
    fulfilled: boolean,

    children: ReactNode;
}

export function DroppableBox({ id, enabled, fulfilled, children }: DroppableProps) {
    const { ref } = useDroppable({
        id,
    });

    if (fulfilled) {
        return (
            <div ref={ref} className="droppable-box">
                <span className="cell-letter">{children}</span>
            </div>
        )
    } else if (enabled) {
        return (
            <div ref={ref} className="droppable-box">
                <span className="cell-letter"></span>
            </div>
        )
    } else {
        return (
            <div ref={ref} className="invisible-box">
                <span className="cell-letter"></span>
            </div>
        )
    }
}
