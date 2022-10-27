import axios from "axios";
import { parse } from "node-html-parser";
import { isWebUri } from "valid-url";
async function crawlUrl(url) {
  const response = await axios.get(url);
  const body = await response.data;

  const root = parse(body);
  const links = root
    .querySelectorAll("a")
    .map((anchor) => anchor.getAttribute("href"))
    .filter(isWebUri);
  return [links, body];
}

export {
  crawlUrl
};
