import { useDroppable } from '@dnd-kit/react';
import type { ReactNode } from 'react';
import type { Cell } from './Types';

interface DroppableProps { // TODO Merge w/ Cell 
    id: string;
    enabled: boolean,
    fulfilled: boolean,
    flag?: Cell["img"],

    children: ReactNode;
}

export function DroppableBox({ id, enabled, fulfilled, flag, children }: DroppableProps) {
    const { ref } = useDroppable({
        id,
    });

    if (flag) {
        return (
            <div ref={ref} className="droppable-box flag">
                <img alt={flag.alt} src={flag.src} />
            </div>
        )
    }

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
