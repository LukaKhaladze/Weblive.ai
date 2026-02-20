import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getByPath, setByPath } from "@/lib/pathAccess";

describe("pathAccess helpers", () => {
  it("updates deep string path immutably", () => {
    const input = {
      pages: [
        {
          sections: [{ props: { headline: "Old" } }],
        },
      ],
    };
    const output = setByPath(input, "pages.0.sections.0.props.headline", "New");
    assert.equal(getByPath(output, "pages.0.sections.0.props.headline"), "New");
    assert.equal(getByPath(input, "pages.0.sections.0.props.headline"), "Old");
  });

  it("creates missing paths", () => {
    const output = setByPath({} as Record<string, unknown>, "a.b.0.c", "x");
    assert.equal(getByPath(output, "a.b.0.c"), "x");
  });
});
