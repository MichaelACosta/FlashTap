import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

function Bomb(): never {
  throw new Error("boom");
}

describe("ErrorBoundary (US-23)", () => {
  it("renders children normally when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>conteúdo normal</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("conteúdo normal")).toBeInTheDocument();
  });

  it("shows a friendly fallback and reports the error to Sentry when a child throws", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Ocorreu um erro, reinicie o jogo.");
    expect(screen.getByRole("button", { name: "Recarregar" })).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
