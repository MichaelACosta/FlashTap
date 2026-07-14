import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { BoardButtonViewModel } from "@/application";
import { Board } from "./Board";

function buildButtons(overrides: Partial<Record<number, Partial<BoardButtonViewModel>>> = {}) {
  return Array.from({ length: 12 }, (_, index) => {
    const id = index + 1;
    return { id, state: "idle" as const, disabled: false, ...overrides[id] };
  });
}

describe("Board", () => {
  it("renders all 12 buttons in id order (GRS §3)", () => {
    render(<Board buttons={buildButtons()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(12);
    expect(buttons.map((button) => button.textContent)).toEqual(
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
  });

  it("passes each button's visual state and disabled flag through", () => {
    render(<Board buttons={buildButtons({ 4: { state: "showing", disabled: true } })} />);

    const showingButton = screen.getByRole("button", { name: "Botão 4, destacado" });
    expect(showingButton).toBeDisabled();
  });

  it("calls onButtonClick with the clicked button's id", () => {
    const onButtonClick = vi.fn();
    render(<Board buttons={buildButtons()} onButtonClick={onButtonClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Botão 9" }));

    expect(onButtonClick).toHaveBeenCalledWith(9);
  });
});
