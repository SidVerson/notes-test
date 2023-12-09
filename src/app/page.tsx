'use client'
import Image from 'next/image'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import CreateModal from '@/components/createModal'
import { useNotesStore } from '@/store/noteStore'
import { NoteItem } from '@/components/noteItem'
import {
    Autocomplete,
    AutocompleteSection,
    AutocompleteItem,
} from '@nextui-org/autocomplete'
import { useMemo, useState } from 'react'

export default function Home() {
    const notes = useNotesStore((state) => state.notes)
    // Extract unique tags from notes
    const allTags = Array.from(new Set(notes.flatMap((note) => note.hashtags)))

    // Autocomplete state
    const [selectedTags, setSelectedTags] = useState([])

    // Autocomplete change handler
    const handleTagChange = (tags) => {
        // Ensure that tags is always an array
        const updatedTags = Array.isArray(tags) ? tags : tags ? [tags] : []

        setSelectedTags(updatedTags)
    }

    return (
        <Card>
            <CardHeader>
                CREATE NOTES
                <Autocomplete
                    defaultItems={allTags.map((tag) => ({
                        value: tag,
                        label: `${tag}`,
                    }))}
                    label='Filter by Tags'
                    placeholder='Search tags'
                    onSelectionChange={handleTagChange}
                >
                    {(tag) => (
                        <AutocompleteItem key={tag.value}>
                            {tag.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </CardHeader>
            <CardBody className='grid grid-cols-2 gap-4 scroll-smooth overflow-auto'>
                {notes
                    .filter((note) =>
                        selectedTags.every((tag) => note.hashtags.includes(tag))
                    )
                    .map((note) => (
                        <NoteItem key={note.id} note={note} />
                    ))}
                <Card>
                    <CardBody className='flex center justify-center items-center'>
                        <CreateModal />
                    </CardBody>
                </Card>
            </CardBody>
        </Card>
    )
}
