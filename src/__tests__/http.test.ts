import { crawlUrl } from "../pages/api/util/http";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("Crawl Url", () => {
  it("Should return the links in the page", () => {
    const data = '<div><h1>Hello World!</h1><a href="https://testlink.com">link</a></div>';
    mockedAxios.get.mockResolvedValue({
      data: data
    }); 
    expect(crawlUrl("https://test.com/")).resolves.toEqual([["https://testlink.com"], data]);
  });

  it("Should return no links if the page contains none", () => {
    const data = '<div><h1>Hello World!</h1><p>some text</p></div>';
    mockedAxios.get.mockResolvedValue({
      data: data
    }); 
    expect(crawlUrl("https://test.com/")).resolves.toEqual([[], data]);
  });

});
