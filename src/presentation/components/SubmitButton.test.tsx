import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  it("renders disabled when disabled is true (GRS §12: Enviar inicia desabilitado)", () => {
    render(<SubmitButton disabled={true} />);

    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  it("renders enabled when disabled is false", () => {
    render(<SubmitButton disabled={false} />);

    expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled();
  });

  it("calls onClick when enabled and clicked", () => {
    const onClick = vi.fn();
    render(<SubmitButton disabled={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<SubmitButton disabled={true} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
