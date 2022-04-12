/**
 * NoteList.tsx
 *
 * Renders all notes for the selected plant
 * @author Yousef.
 */

import * as React from "react";
import { Button, Input, Flex, Checkbox, Heading, Box } from "@chakra-ui/react";
import { useStore } from "lib/store/store";

function NoteListItems() {
    const store = useStore((state) => state);

    return (
        <Box height={300} overflow={"auto"} className="sd" zIndex={-1}>
            {(store.notes[store.selectedPlantID] || []).map((note) => (
                <Flex pt={2} key={note.id}>
                    <Checkbox
                        onClick={() => store.toggleNote(note.id)}
                        checked={note.done}
                    />
                    <Input
                        mx={2}
                        flex={10}
                        value={note.text}
                        onChange={(evt) =>
                            store.setNewNote(evt.target.value, undefined)
                        }
                        placeholder="New note"
                    />
                    <Button onClick={() => store.removeNote(note.id)}>
                        Delete
                    </Button>
                </Flex>
            ))}
        </Box>
    );
}

function NoteList() {
    return (
        <>
            <NoteListItems />
        </>
    );
}

export default NoteList;
