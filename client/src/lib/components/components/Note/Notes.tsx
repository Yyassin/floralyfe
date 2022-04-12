/**
 * Notes.tsx
 *
 * Render notes and note input to add/edit notes.
 * @author Yousef
 */

import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import NoteAdd from "./NoteAdd";
import NoteList from "./NoteList";

const Notes = () => {
    return (
        <Box
            p="4"
            margin={5}
            marginLeft={0}
            w={[200, 200, 350, 500, 600, 950]}
            height={350}
            borderRadius="lg"
            overflow="hidden"
        >
            <Heading as="h2" size="md">
                Notes
            </Heading>
            <NoteAdd />
            <NoteList />
        </Box>
    );
};

export default Notes;
