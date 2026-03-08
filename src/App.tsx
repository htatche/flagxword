const SIZE = 15

export function App() {
    const cells = Array.from({length: SIZE * SIZE})

    return (
        <main className="app-shell">
            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
                }}
            >
                {cells.map((_, i) => (
                    <button key={i} type="button" aria-label={`Cell ${Math.floor(i / SIZE) + 1}-${(i % SIZE) + 1}`}>
                        M
                    </button>
                ))}
            </div>
        </main>
    )
}
