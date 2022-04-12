/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlantCard from "lib/components/components/PlantCard/PlantCard";
import { Plant } from "lib/store/slices/plantSlice";
import { useStore } from "lib/store/store";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "lib/styles/customTheme";

// getByRole
// toBeInTheDocument
// toHaveTextContent
// onClick can be called as fn

const props: Plant = {
    id: "demo-id",
    name: "demo-name",
    species: "demo-species",
    angle: 0,
    channel: 1,
    description: "demo-description",
    optima: {
        soilMoisture: 2,
        temperature: 3,
        humidity: 4,
    },
    wiki: "wiki.com",
    image: "demo-img",
};

const originalState = useStore.getState();

describe("PlantCard", () => {
    beforeEach(() => {
        useStore.setState(originalState);
    })

    test("renders PlantCard", () => {
        render(<PlantCard {...props} />);
    });

    test("PlantCard::Renders PlantCard", () => {
        render(
            <ChakraProvider theme={customTheme}>
                <PlantCard {...props} />
            </ ChakraProvider>
        );

        const channelDiv = screen.getByRole("channel");
        expect(channelDiv).toHaveTextContent(
            `Connected to channel ${props.channel}`
        );

        const nameDiv = screen.getByRole("name");
        expect(nameDiv).toHaveTextContent(
            props.name
        );

        const speciesDiv = screen.getByRole("species");
        expect(speciesDiv).toHaveTextContent(
            props.species
        );
        
        const criticalityDiv = screen.getByRole("criticality");
        expect(criticalityDiv).toHaveTextContent(
            "optimal"
        );

        const buttonElement = screen.getByRole("setId");
        fireEvent.click(buttonElement);

        const { selectedPlantID } = useStore.getState();
        expect(selectedPlantID).toEqual(props.id)
    });
});
