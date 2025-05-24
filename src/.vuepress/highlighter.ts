import {LanguageRegistration} from "@shikijs/types";

export const gitAttributesHighlighter : LanguageRegistration = {
  name: "gitattributes",
  scopeName: "source.gitattributes",
  patterns: [
    {
      name: "comment.line.gitattributes",
      begin: "#",
      end: "\\n",
      beginCaptures: {
        0: { name: "punctuation.definition.comment.gitattributes" }
      }
    },
    {
      match: "(-?)(linguist-[a-zA-Z-]+)(=?)([0-9a-zA-Z-]*)",
      captures: {
        1: { name: "punctuation.other.negation.gitattributes" },
        2: { name: "keyword.other.definition.gitattributes" },
        3: { name: "punctuation.separator.key-value.gitattributes" },
        4: { name: "variable.parameter.gitattributes" }
      }
    },
    {
      name: "keyword.operator.wildcard.gitattributes",
      match: "\\*|\\?|\\[.*?\\]"
    },
    {
      name: "string.unquoted.raw.gitattributes",
      match: "[^\\s*?]+"
    },
  ],
  repository: {},
};