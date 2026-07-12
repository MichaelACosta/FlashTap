import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordChip } from "./RecordChip";

describe("RecordChip", () => {
  it("renders '—' when there is no record yet (US-02)", () => {
    render(<RecordChip value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders the record value when it exists", () => {
    render(<RecordChip value="7.4" />);
    expect(screen.getByText("7.4")).toBeInTheDocument();
  });
});
