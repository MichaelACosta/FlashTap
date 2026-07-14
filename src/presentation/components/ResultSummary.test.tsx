import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultSummary } from "./ResultSummary";

describe("ResultSummary (GRS §16)", () => {
  it("renders progress, distance, time and record fields", () => {
    render(
      <ResultSummary progress="1.1" distance="11 níveis e 4 rodadas" tempo="00:12" record="3.2" />,
    );

    expect(screen.getByRole("region", { name: "Fim de partida" })).toBeInTheDocument();
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("11 níveis e 4 rodadas")).toBeInTheDocument();
    expect(screen.getByText("00:12")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("renders '—' for tempo and record when they are null", () => {
    render(
      <ResultSummary progress="1.1" distance="11 níveis e 4 rodadas" tempo={null} record={null} />,
    );

    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("does not render a restart/reiniciar control (US-16 is out of scope for this slice)", () => {
    render(
      <ResultSummary progress="1.1" distance="11 níveis e 4 rodadas" tempo={null} record={null} />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
