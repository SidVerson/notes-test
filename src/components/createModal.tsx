'use client'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/store/noteStore'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Textarea } from '@nextui-org/input'
export default function CreateModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [noteForm, setNoteForm] = useState<NoteForm>({
        name: '',
        noteText: '',
        hashtags: [],
    })

    const addNote = useNotesStore((state) => state.addNote)
    const notes = useNotesStore((state) => state.notes)
    const handleCreateNote = () => {
        addNote(noteForm)

        setNoteForm({} as NoteForm)
        onOpenChange()
    }
    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value
        if (event.target.value.length < 50) {
            const tagMatches = inputValue.match(/#(\w+)/g)
            setNoteForm({
                ...noteForm,
                name: event.target.value,
            })
        }
        // Ищем хэштеги в заголовке и добавляем к массиву hashtags
    }

    const handleChangeEditor = (event: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value
        const tagMatches = inputValue.match(/#(\w+)/g)
        setNoteForm({
            ...noteForm,
            noteText: event.target.value,
        })
    }

    useEffect(() => {
        const combinedText = `${noteForm.name} ${noteForm.noteText}`
        const tagMatches = combinedText.match(/#[а-яА-Яa-zA-Z0-9_-]+/g)

        if (tagMatches) {
            const uniqueTags = Array.from(new Set(tagMatches.map((tag) => tag)))
            setNoteForm((prevState) => ({
                ...prevState,
                hashtags: uniqueTags,
            }))
        }
    }, [noteForm.name, noteForm.noteText])

    type NoteForm = Pick<NoteModel, 'name' | 'noteText' | 'hashtags'>
    return (
        <>
            <Button variant='light' isIconOnly onPress={onOpen}>
                <PlusCircleIcon />
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement='top-center'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>
                                Создать заметку
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label='Заголовок'
                                    placeholder='Введите заголовок заметки'
                                    variant='bordered'
                                    onChange={handleChangeTitle}
                                />
                                <Textarea
                                    label='Текст'
                                    placeholder='Введите текст заметки'
                                    variant='bordered'
                                    onChange={handleChangeEditor}
                                />
                                {noteForm.hashtags ? (
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: noteForm.hashtags.join(' '),
                                        }}
                                    />
                                ) : (
                                    <p>Нет текста</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color='danger'
                                    variant='flat'
                                    onPress={onClose}
                                >
                                    Закрыть
                                </Button>
                                <Button
                                    color='primary'
                                    onPress={handleCreateNote}
                                >
                                    Создать
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
