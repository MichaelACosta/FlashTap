import { describe, expect, it } from "vitest";
import { isScaffoldReady } from "./index";

describe("domain scaffold", () => {
  it("proves the Vitest pipeline runs against the domain layer", () => {
    expect(isScaffoldReady()).toBe(true);
  });
});
