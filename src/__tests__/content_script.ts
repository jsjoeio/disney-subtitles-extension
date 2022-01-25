import jsdom from "jsdom";
import {
  getSubtitles,
  isEmailInDOM,
  getSubtitleInnerText,
  getGitHubUsernameFromURL,
  fetchGitHubUserEventData,
  getEmailFromGitHubEventData,
  insertEmailIntoDOM,
  buildEmailElement,
} from "../content_script";

const { JSDOM } = jsdom;

describe("isEmailInDOM", () => {
  describe("without email in DOM", () => {
    let mockDocument: Document;

    beforeEach(() => {
      // initialize DOM with empty body
      mockDocument = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`).window
        .document;
    });
    it("should return false if it doesn't", () => {
      expect(isEmailInDOM(mockDocument)).toBe(false);
    });
  });
  describe("with the email in DOM", () => {
    let mockDocument: Document;

    beforeEach(() => {
      // initialize DOM with empty body
      mockDocument = new JSDOM(
        `<!DOCTYPE html><a class="u-email Link--primary " href="mailto:joe@gmail.com">joe@gmail.com</a>`
      ).window.document;
    });
    it("should return true if it does", () => {
      expect(isEmailInDOM(mockDocument)).toBe(true);
    });
  });
});

describe("getGitHubUsernameFromURL", () => {
  let mockLocation: Location;

  beforeEach(() => {
    // initialize DOM with empty body
    mockLocation = new JSDOM(
      `<!DOCTYPE html><a class="u-email Link--primary " href="mailto:joe@gmail.com">joe@gmail.com</a>`,
      {
        url: "https://github.com/jsjoeio",
      }
    ).window.location;
  });
  it("should parse the GitHub username and return it", () => {
    const username = getGitHubUsernameFromURL(mockLocation);
    const expected = "jsjoeio";
    expect(username).toBe(expected);
  });
});

describe("fetchGitHubUserEventData", () => {
  it("should return data", async () => {
    // implement
    const username = "jsjoeio";
    const data = await fetchGitHubUserEventData(username);
    expect(data).not.toBeNull();
  });
});

describe("getEmailFromGitHubEventData", () => {
  it("should return null if no data", () => {
    const fakeData: any[] = [];
    const email = getEmailFromGitHubEventData(fakeData);
    const expected = null;
    expect(email).toBe(expected);
  });
  it("should return the email if it exists", () => {
    // const fakeData: Awaited<ReturnType<typeof fetchGitHubUserEventData>> = [
    const fakeData: any[] = [
      {
        id: "19068279411",
        type: "PushEvent",
        actor: {
          id: 3806031,
          login: "jsjoeio",
          display_login: "jsjoeio",
          gravatar_id: "",
          url: "https://api.github.com/users/jsjoeio",
          avatar_url: "https://avatars.githubusercontent.com/u/3806031?",
        },
        repo: {
          id: 431949686,
          name: "jsjoeio/github-email-extension",
          url: "https://api.github.com/repos/jsjoeio/github-email-extension",
        },
        payload: {
          push_id: 8480559582,
          size: 2,
          distinct_size: 2,
          ref: "refs/heads/master",
          head: "2ae3fbb9a32d73842b180bfde3ee940bb2a16f2e",
          before: "562e3aac529aba67a449f36521c6cb836060e179",
          commits: [
            {
              sha: "a5eaa154e8392f401636b862adb721437dd53274",
              author: {
                email: "joe@gmail.com",
                name: "Joe",
              },
              message: "feat: add isEmailinDOM",
              distinct: true,
              url: "https://api.github.com/repos/jsjoeio/github-email-extension/commits/a5eaa154e8392f401636b862adb721437dd53274",
            },
            {
              sha: "2ae3fbb9a32d73842b180bfde3ee940bb2a16f2e",
              author: {
                email: "joe@gmail.com",
                name: "Joe",
              },
              message: "feat: add getGitHubUsernameFromURL",
              distinct: true,
              url: "https://api.github.com/repos/jsjoeio/github-email-extension/commits/2ae3fbb9a32d73842b180bfde3ee940bb2a16f2e",
            },
          ],
        },
        public: true,
        created_at: "2021-11-26T16:50:02Z",
      },
    ];
    const email = getEmailFromGitHubEventData(fakeData);
    const expected = "joe@gmail.com";
    expect(email).toBe(expected);
  });
});

describe("insertEmailIntoDOM", () => {
  let mockDocument: Document;

  beforeEach(() => {
    // initialize DOM with empty body
    mockDocument = new JSDOM(`
<!DOCTYPE html>
<body>
  <ul class="vcard-details">
    <li title="Member since" class="vcard-detail pt-1 css-truncate css-truncate-target "><svg class="octicon octicon-clock" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"></path></svg>
      <span class="join-label">Joined </span>
      <relative-time datetime="2021-11-03T09:04:50Z" class="no-wrap" title="Nov 3, 2021, 2:04 AM MST">24 days ago</relative-time>
    </li>
  </ul>
</body>`).window.document;
  });
  it("should add the email to the dom", () => {
    // Make sure it's not there from the start
    let isinDom = isEmailInDOM(mockDocument);
    expect(isinDom).toBe(false);

    // Now check after inserting into the dom
    const mockEmailFromGitHub = "joe@gmail.com";
    insertEmailIntoDOM(mockDocument, mockEmailFromGitHub);
    isinDom = isEmailInDOM(mockDocument);
    expect(isinDom).toBe(true);
  });
});

describe("buildEmailElement", () => {
  it("should return an email element", () => {
    const mockEmail = "joe@gmail.com";
    const actual = buildEmailElement(mockEmail);
    const expected = `<li itemprop="email" aria-label="Email: ${mockEmail}" class="vcard-detail pt-1 css-truncate css-truncate-target "><svg class="octicon octicon-mail" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"></path></svg>
  <a class="u-email Link--primary " href="mailto:${mockEmail}">${mockEmail}</a>
</li>`;
    expect(actual).toBe(expected);
  });
});

/*
  Notes
It should handle multiple lines (i.e. two subtitle lines).
It should return subtitles with accents.

*/

describe("getSubtitleInnerText", () => {
  let mockDocument: Document;

  beforeEach(() => {
    // initialize DOM with empty body
    mockDocument = new JSDOM(
      `<!DOCTYPE html><span class="dss-subtitle-renderer-cue" style="color: rgb(255, 255, 255); font-size: 17.21px; font-family: Console, sans-serif;"><span class="dss-subtitle-renderer-line" style="background-color: rgba(0, 0, 0, 0.75);">Ah, le gusta tener todo bajo control.</span></span>`
    ).window.document;
  });
  it("should return the text", () => {
    const child = mockDocument.querySelector(".dss-subtitle-renderer-cue");
    const actual = getSubtitleInnerText(child);
    const expected = "Ah, le gusta tener todo bajo control.";
    expect(actual).toBe(expected);
  });
});

describe.only("getSubtitles", () => {
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
