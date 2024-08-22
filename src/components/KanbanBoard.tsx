import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'
import { CiCirclePlus } from "react-icons/ci"
import ColumnContainer from '@/components/column-container'

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

export type Id = string | number

export type Column = {
    id: Id
    title: string
}

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
    )

    return (
        <div>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className='flex flex-col gap-4'>
                    <Button
                        className='flex gap-2 justify-center mx-auto'
                        onClick={() => {
                            createNewColumn()
                        }}
                    >
                        <CiCirclePlus className={'w-[16px] h-[16px] md:w-[20px] md:h-[20px]'} />
                        Adicionar Coluna
                    </Button>
                    <div className='flex gap-4 items-center overflow-x-auto justify-start'>
                        <div className='flex' key={generateId()}>
                            <SortableContext items={columnsId}>
                                {columns.map(col => (
                                    <ColumnContainer
                                        column={col}
                                        key={col.id}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                            />
                        )}
                    </DragOverlay>,
                    document.body,
                )}
            </DndContext>
        </div>
    )

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Coluna ${columns.length + 1}`,
        }
        setColumns([...columns, columnToAdd])
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id)
        setColumns(filteredColumns)
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col
            return { ...col, title }
        })

        setColumns(newColumns)
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) {
            return
        }

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) {
            return
        }

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)

            const overColumnIndex = columns.findIndex(col => col.id === overColumnId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
}

function generateId() {
    return Math.floor(Math.random() * 10001)
}

export default KanbanBoard