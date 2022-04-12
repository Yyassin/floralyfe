/**
 * NoteAdd.tsx
 *
 * Input form to add a plant note.
 * @author Yousef.
 */

import * as React from "react";
import { Button, Input, Grid, Flex } from "@chakra-ui/react";
import { useStore } from "lib/store/store";

const NoteAdd = () => {
    const store = useStore((state) => state);

    return (
        <Grid pt={2} templateColumns="5fr 1fr" columnGap="3">
            <Flex>
                <Input
                    flex={10}
                    value={store.newNote.text}
                    onChange={(evt) =>
                        store.setNewNote(evt.target.value, undefined)
                    }
                    placeholder="New note"
                />
            </Flex>
            <Button
                onClick={() => {
                    store.addNote();
                }}
            >
                Add Note
            </Button>
        </Grid>
    );
};

export default NoteAdd;
