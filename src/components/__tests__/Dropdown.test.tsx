import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import { fetchCatalog } from "../../api/api";
import Dropdown from "../Dropdown";

jest.mock("../../api/api", () => ({
  fetchCatalog: jest.fn(),
}));

const mockedFetchCatalog = fetchCatalog as jest.MockedFunction<
  typeof fetchCatalog
>;

describe("Dropdown Component", () => {
  const mockOnSelect = jest.fn();
  const mockOptions = ["HP1", "HP2", "HP3"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockedFetchCatalog.mockImplementation(() => new Promise(() => {}));
    render(<Dropdown onSelect={mockOnSelect} selectedValue="" />);
    expect(screen.getByText("Loading options...")).toBeTruthy();
  });

  it("displays error message when API fails", async () => {
    mockedFetchCatalog.mockRejectedValueOnce(new Error("An error occurred"));
    render(<Dropdown onSelect={mockOnSelect} selectedValue="" />);
    await waitFor(() => {
      expect(screen.getByText("Error: An error occurred")).toBeTruthy();
    });
  });

  it("renders options and handles selection", async () => {
    mockedFetchCatalog.mockResolvedValueOnce(mockOptions);
    render(<Dropdown onSelect={mockOnSelect} selectedValue="" />);

    await waitFor(() => {
      expect(screen.queryByText("Loading options...")).toBeFalsy();
    });

    const picker = screen.getByTestId("picker");
    fireEvent(picker, "onValueChange", "HP1");
    expect(mockOnSelect).toHaveBeenCalledWith("HP1");
  });
});
