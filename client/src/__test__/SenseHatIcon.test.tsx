/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SenseHatIcon from "lib/components/components/SenseHatIcon/SenseHatIcon";

// getByRole
// toBeInTheDocument
// toHaveTextContent
// onClick can be called as fn

test("renders Sense Hat Icon", () => {
    render(<SenseHatIcon />);
});

test("SenseHat::Handles onClick", () => {
    render(<SenseHatIcon />);

    const state = screen.getByRole("sense-state");
    expect(state).toHaveTextContent("MOISTURE");

    const buttonElement = screen.getByRole("sense-wrapper");

    fireEvent.click(buttonElement);
    expect(state).toHaveTextContent("WATER_LEVEL");
    
    fireEvent.click(buttonElement);
    expect(state).toHaveTextContent("TEMPERATURE");

    fireEvent.click(buttonElement);
    expect(state).toHaveTextContent("HUMIDITY");
});