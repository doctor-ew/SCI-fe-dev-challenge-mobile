import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import React from "react";

import * as api from "../../api/api";
import CardList from "../CardList";

jest.mock("../../api/api");

describe("CardList Component", () => {
  const mockCards = [
    {
      Set: "Set1",
      Number: "001",
      Name: "Card 1",
      Type: "Unit",
      Cost: "1",
      HP: "3",
      Power: "3",
      Traits: [],
      Rarity: "Common",
      FrontArt: "https://example.com/card1.jpg",
    },
    {
      Set: "Set2",
      Number: "002",
      Name: "Card 2",
      Type: "Unit",
      Cost: "2",
      HP: "4",
      Power: "5",
      Traits: [],
      Rarity: "Rare",
      FrontArt: "https://example.com/card2.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.searchCards as jest.Mock).mockResolvedValue(mockCards);
  });

  it("displays welcome message when no HP is selected", () => {
    render(<CardList />);
    expect(screen.getByText(/Welcome to the Card Browser!/i)).toBeTruthy();
  });

  it("renders cards and allows sorting", async () => {
    render(<CardList hp="HP1" />);

    expect(screen.getByText(/Loading cards.../i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Card 1")).toBeTruthy();
      expect(screen.getByText("Card 2")).toBeTruthy();
    });

    expect(screen.getByText("Sort by Name")).toBeTruthy();
    expect(screen.getByText("Sort by Set")).toBeTruthy();
    expect(screen.getByText("Sort by Cost")).toBeTruthy();
    expect(screen.getByText("Sort by Power")).toBeTruthy();

    fireEvent.press(screen.getByText("Sort by Name"));
    fireEvent.press(screen.getByText("Sort by Set"));
    fireEvent.press(screen.getByText("Sort by Cost"));
    fireEvent.press(screen.getByText("Sort by Power"));
  });

  it("displays error state when API call fails", async () => {
    (api.searchCards as jest.Mock).mockRejectedValue(
      new Error("Failed to load cards")
    );
    render(<CardList hp="HP1" />);

    expect(screen.getByText(/Loading cards.../i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Failed to load cards")).toBeTruthy();
    });
  });

  it("displays 'No cards found' when API returns empty array", async () => {
    (api.searchCards as jest.Mock).mockResolvedValue([]);
    render(<CardList hp="HP1" />);

    await waitFor(() => {
      expect(screen.getByText("No cards found.")).toBeTruthy();
    });
  });
});
