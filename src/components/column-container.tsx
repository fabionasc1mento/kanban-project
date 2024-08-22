import { useState } from 'react'
import { Column, Id } from '@/components/KanbanBoard'
import { Button } from '@/components/ui/button'
import { BsTrash3 } from 'react-icons/bs'
import { CiCirclePlus } from "react-icons/ci"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Input } from './ui/input'

interface Props {
    column: Column
    deleteColumn: (id: Id) => void
    updateColumn: (id: Id, title: string) => void
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn } = props

    const [editMode, setEditMode] = useState(false)
    const [inputValue, setInputValue] = useState(column.title)

    const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleBlur = () => {
        updateColumn(column.id, inputValue)
        setEditMode(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateColumn(column.id, inputValue)
            setEditMode(false)
        }
    }

    if (isDragging) {
        return (
            <div className='p-4'>
                <div
                    ref={setNodeRef}
                    style={style}
                    className='bg-white-200 border-2 border-blue-500 w-[250px] md:w-[350px] h-[350px] md:h-[500px] max-h-[500px] rounded-md flex flex-col'
                ></div>
            </div>
        )
    }

    return (
        <>
            <div className='p-4'>
                <div
                    ref={setNodeRef}
                    style={style}
                    className='bg-gray-100 w-[250px] md:w-[350px] h-[350px] md:h-[500px] max-h-[500px] rounded-md flex flex-col'
                >
                    <div
                        {...attributes}
                        {...listeners}
                        onClick={() => setEditMode(true)}
                        className='text-md bg-white cursor-grab rounded-lg p-3 font-bold border-4 border-gray-100 flex items-center justify-between'
                    >
                        <div className='flex items-center gap-2'>
                            <div className='flex justify-center items-center px-2 py-1 text-sm font-bold border border-gray-500 rounded-full'>
                                0
                            </div>
                            {!editMode && column.title}
                            {editMode && (
                                <Input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    autoFocus
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                />
                            )}
                        </div>
                        <Button
                            className='bg-transparent hover:bg-transparent group'
                            onClick={() => deleteColumn(column.id)}
                        >
                            <BsTrash3 className='text-gray-400 group-hover:text-gray-700 transition-300' size='18' />
                        </Button>
                    </div>
                    <div className='flex flex-grow p-3'>teste</div>
                    <div className='p-3'>
                        <Button className='flex gap-2 mx-auto'>
                            <CiCirclePlus className={'w-[16px] h-[16px] md:w-[20px] md:h-[20px]'} />
                            Adicionar Projeto
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ColumnContainer
