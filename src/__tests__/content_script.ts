import jsdom from "jsdom";
import { getSubtitles } from "../content_script";

const { JSDOM } = jsdom;

describe("getSubtitles", () => {
  let mockDocument: Document;

  beforeEach(() => {
    // initialize DOM with empty body
    mockDocument = new JSDOM(
      `<!DOCTYPE html><span class="dss-subtitle-renderer-cue" style="color: rgb(255, 255, 255); font-size: 15.38px; font-family: Console, sans-serif;"><span class="dss-subtitle-renderer-line" style="background-color: rgba(0, 0, 0, 0.75); padding: 0px;"><i>We are in position</i></span>
      <span class="dss-subtitle-renderer-line" style="background-color: rgba(0, 0, 0, 0.75); padding: 0px;"><i>and awaiting</i></span>
      <span class="dss-subtitle-renderer-line" style="background-color: rgba(0, 0, 0, 0.75); padding: 0px;"><i>your diversion.</i></span></span>`
    ).window.document;
  });
  it("should return the text", () => {
    const actual = getSubtitles(mockDocument);
    const expected = "We are in position and awaiting your diversion.";
    expect(actual).toBe(expected);
  });
});
