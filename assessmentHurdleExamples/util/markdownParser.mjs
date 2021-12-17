import { marked } from "marked";

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
});
const text = ``;
console.log(marked.parse(text));
