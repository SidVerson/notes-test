'use client'
import { FC, MouseEventHandler } from 'react'
import { useNotesStore } from '@/store/noteStore'
import { EditModal } from './editModal'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { TrashIcon } from '@heroicons/react/20/solid'
import { Divider } from '@nextui-org/divider'

interface INoteItemProps {
    note: NoteModel
    searchTerm?: string
}
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/modal'

interface IEditNoteProps {
    note: NoteModel
    className?: string
}

export const NoteItem: FC<INoteItemProps> = ({ note, searchTerm }) => {
    const removeNote = useNotesStore((state) => state.removeNote)
    const handleRemoveNote: MouseEventHandler<HTMLButtonElement> = (
        event
    ): void => {
        event.stopPropagation()
        removeNote(note.id)
    }
    return (
        <Card className=' min-w-[500px] max-h-[300px] min-h-[150px] snap-normal snap-center'>
            <CardHeader className='flex justify-between h-[40%]'>
                <h1 className='font-bold text-2xl'>{note?.name}</h1>
                <div>
                    <EditModal note={note} className='float-right' />
                    <Button
                        variant='light'
                        isIconOnly
                        onClick={handleRemoveNote}
                        color='danger'
                    >
                        <TrashIcon className='w-4 h-4' />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className='h-fit overscroll-none'>
                {note.noteText ? (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: note.noteText,
                        }}
                    />
                ) : (
                    <p>Нет текста</p>
                )}
            </CardBody>
            <CardFooter>
                {note.hashtags ? (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: note.hashtags.join(' '),
                        }}
                    />
                ) : (
                    <p>Нет текста</p>
                )}
            </CardFooter>
        </Card>
    )
}
