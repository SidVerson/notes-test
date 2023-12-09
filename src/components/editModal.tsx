'use client'
import { useNotesStore } from '@/store/noteStore'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/modal'
import { Button, Input } from '@nextui-org/react'
import { ChangeEvent, FC, useState } from 'react'
import { PencilIcon } from '@heroicons/react/20/solid'
import { Textarea } from '@nextui-org/input'
import * as ReactDOMServer from 'react-dom/server'

interface IEditNoteProps {
    note: NoteModel
    className: string
}

const TagHighlightInput: FC<{
    value: string
    onChange: (value: string) => void
}> = ({ value, onChange }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value)
    }

    const highlightTags = (text: string): JSX.Element[] => {
        const parts = text.split(/(#\w+)/g)
        return parts.map((part, index) =>
            part.startsWith('#') ? (
                <span key={index} className='text-primary'>
                    {part}
                </span>
            ) : (
                part
            )
        )
    }

    return (
        <div>
            <input type='text' value={value} onChange={handleInputChange} />
            <div>{highlightTags(value)}</div>
        </div>
    )
}

export const EditModal: FC<IEditNoteProps> = ({ note }, className = '') => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    type NoteForm = Pick<NoteModel, 'name' | 'noteText' | 'hashtags'>
    const [noteForm, setNoteForm] = useState<NoteForm>({
        name: note.name,
        noteText: note.noteText,
        hashtags: [],
    })
    const editNote = useNotesStore((state) => state.editNote)
    const notes = useNotesStore((state) => state.notes)
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value.length < 50)
            setNoteForm({ ...noteForm, name: e.target.value })
    }

    const handleChangeEditor = (e: ChangeEvent<HTMLInputElement>): void => {
        setNoteForm({ ...noteForm, noteText: e.target.value })
    }

    const handleEditNote = (): void => {
        editNote({
            ...note,
            name: noteForm.name,
            noteText: noteForm.noteText,
        })
        onOpenChange()
    }

    return (
        <>
            <Button
                variant='light'
                onPress={onOpen}
                className={className}
                isIconOnly
            >
                <PencilIcon className='w-4 h-4' />
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement='top-center'
            >
                <ModalContent>
                    {(onOpenChange) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>
                                Изменить
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label='Заголовок'
                                    placeholder='Введите заголовок модели'
                                    variant='bordered'
                                    value={noteForm.name}  
                                    onChange={handleInputChange}
                                    startContent={noteForm.hashtags.join(' ')}
                                />
                                <TagHighlightInput
                                    value={noteForm.name}
                                    onChange={handleInputChange}
                                />
                                <Textarea
                                    label='Текст'
                                    placeholder='Введите текст заметки'
                                    variant='bordered'
                                    value={noteForm.noteText}
                                    onChange={handleChangeEditor}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color='danger'
                                    variant='flat'
                                    onPress={onOpenChange}
                                >
                                    Закрыть
                                </Button>
                                <Button
                                    color='primary'
                                    isDisabled={
                                        (note.name === noteForm.name &&
                                            note.noteText ===
                                                noteForm.noteText) ||
                                        !noteForm?.name
                                    }
                                    onPress={handleEditNote}
                                >
                                    Изменить
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
