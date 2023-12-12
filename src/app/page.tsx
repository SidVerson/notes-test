'use client'
import { useMemo, useState } from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@nextui-org/dropdown'
import { Button } from '@nextui-org/button'
import CreateModal from '@/components/createModal'
import { useNotesStore } from '@/store/noteStore'
import { NoteItem } from '@/components/noteItem'

export default function Home() {
    const notes = useNotesStore((state) => state.notes)
    console.log(notes)
    // Extract unique tags from notes
    const allTags = Array.from(new Set(notes.flatMap((note) => note.hashtags)))
    // Autocomplete state
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]))

    // Autocomplete change handler
    const handleTagChange = (tags: string[] | string) => {
        // Ensure that tags is always an array
        const updatedTags = Array.isArray(tags) ? tags : tags ? [tags] : []

        setSelectedTags(new Set(updatedTags))
    }
    const selectedValue = useMemo(
        () => Array.from(selectedTags).join(', ').replaceAll('_', ' '),
        [selectedTags]
    )

    return (
        <Card className='center w-[100%] h-[90%]'>
            <div className='jumbo absolute -inset-[10px] opacity-50'></div>
            <CardHeader>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant='bordered' className='capitalize'>
                            {selectedValue
                                ? selectedValue
                                : 'Фильтр по хэштегам'}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label='Multiple selection example'
                        variant='flat'
                        closeOnSelect={false}
                        selectionMode='multiple'
                        selectedKeys={selectedTags}
                        // ...

                        onSelectionChange={(keys) =>
                            setSelectedTags(keys as Set<string>)
                        }
                    >
                        {allTags
                            .filter((tag) => tag && tag.trim() !== '') // Filter out empty tags
                            .map((tag) => (
                                <DropdownItem key={tag} textValue={tag}>
                                    {tag}
                                </DropdownItem>
                            ))}
                    </DropdownMenu>
                </Dropdown>
            </CardHeader>
            <CardBody className='grid grid-cols-2 gap-4 scroll-smooth overflow-scroll overscroll-contain snap-x auto-cols-fr'>
                {notes && notes.length > 0 ? (
                    notes
                        .filter((note) =>
                            Array.from(selectedTags).every(
                                (tag) =>
                                    note.hashtags && note.hashtags.includes(tag)
                            )
                        )
                        .map((note) => <NoteItem key={note.id} note={note} />)
                ) : (
                    <>
                        <Card className='w-screen min-h-[90px]'>
                            <CardHeader className='flex  justify-center items-center mt-10'>
                                <h1 className='font-bold text-4xl'>
                                    Создайте свою первую заметку!
                                </h1>
                            </CardHeader>
                            <CardBody className='flex center justify-center items-center'>
                                <CreateModal />
                            </CardBody>
                        </Card>
                    </>
                )}
                {notes && notes.length > 0 ? (
                    <Card className='min-w-[500px] min-h-[90px] max-h-[300px]'>
                        <CardBody className='flex center justify-center items-center'>
                            <CreateModal />
                        </CardBody>
                    </Card>
                ) : (
                    <></>
                )}
            </CardBody>
        </Card>
    )
}
