import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timer } from "./Timer";

describe("Timer (US-13)", () => {
  it("renders the formatted elapsed time", () => {
    render(<Timer tempo="00:12" />);

    expect(screen.getByRole("timer", { name: "Tempo decorrido" })).toHaveTextContent("00:12");
  });
});
