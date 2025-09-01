import {LanguageRegistration} from "@shikijs/types";

const gitAttributesHighlighter : LanguageRegistration = {
  name: ".gitattributes",
  scopeName: "source.gitattributes",
  patterns: [
    {
      include: "#main"
    }
  ],
  repository: {
    attribute: { // Individual attribute
      patterns: [
        { // Invalid attribute name
          name: "meta.attribute.gitattributes",
          match: "([-!](?=\\S))?+([^-A-Za-z0-9_.\\s]\\S*)|([-!])(?=\\s|$)",
          captures: {
            1: {
              patterns: [
                {
                  include: "#attributePrefix"
                }
              ]
            },
            2: {
              name: "invalid.illegal.syntax.bad-name.gitattributes"
            },
            3: {
              name: "invalid.illegal.syntax.bad-name.gitattributes"
            }
          }
        },
        { // Valid attribute
          name: "meta.attribute.gitattributes",
          match: "(-|!)?([^\\s=]+)(?:(=)([^\\s]*))?",
          captures: {
            1: {
              patterns: [
                {
                  include: "#attributePrefix"
                }
              ]
            },
            2: {
              name: "variable.parameter.attribute.gitattributes"
            },
            3: {
              name: "punctuation.definition.assignment.equals-sign.gitattributes"
            },
            4: {
              name: "constant.language.other.gitattributes"
            }
          }
        }
      ]
    },
    attributePrefix: {
      patterns: [
        {
          name: "keyword.operator.logical.not.negation.gitattributes",
          match: "-"
        },
        {
          name: "keyword.operator.unset.delete.gitattributes",
          match: "!"
        }
      ]
    },
    comment: { // Comment line
      name: "comment.line.number-sign.gitattributes",
      begin: "#",
      end: "$",
      beginCaptures: {
        0: {
          name: "punctuation.definition.comment.gitattributes"
        }
      }
    },
    main: {
      patterns: [
        {
          include: "#comment"
        },
        {
          include: "#macro"
        },
        {
          include: "#pattern"
        },
        {
          include: "source.gitignore#escape"
        }
      ]
    },
    pattern: { // File pattern
      name: "meta.pattern.gitattributes",
      begin: "(?=[^#\\s])",
      end: "$|(?=#)",
      patterns: [
        {
          include: "source.gitignore#patternInnards"
        },
        {
          name: "meta.attribute-list.gitattributes",
          begin: "\\s",
          end: "(?=$)",
          patterns: [
            {
              include: "#attribute"
            }
          ]
        }
      ]
    }
  }
};

const goModHighlighter : LanguageRegistration = {
  name: "go.mod",
  scopeName: "go.mod",
  patterns: [
    {
      include: "#comments"
    },
    {
      include: "#directive"
    },
    {
      include: "#invalid"
    }
  ],
  repository: {
    directive: {
      patterns: [
        { // Multi-Line directive
          begin: "(\\w+)\\s*\\(",
          beginCaptures: {
            1: {
              name: "keyword.go.mod"
            }
          },
          end: "\\)",
          patterns: [
            {
              include: "#arguments"
            }
          ]
        },
        { // Single-Line directive
          match: "(\\w+)\\s*(.*)",
          captures: {
            1: {
              name: "keyword.go.mod"
            },
            2: {
              patterns: [
                {
                  include: "#arguments"
                }
              ]
            }
          }
        }
      ]
    },
    arguments: {
      patterns: [
        {
          include: "#comments"
        },
        {
          include: "#double_quoted_string"
        },
        {
          include: "#raw_quoted_string"
        },
        {
          include: "#operator"
        },
        {
          include: "#semver"
        },
        {
          include: "#semver_range"
        },
        {
          include: "#unquoted_string"
        }
      ]
    },
    comments: {
      patterns: [
        {
          begin: "//",
          beginCaptures: {
            0: {
              name: "punctuation.definition.comment.go.mod"
            }
          },
          end: "$",
          name: "comment.line.double-slash.go.mod"
        }
      ]
    },
    operator: {
      match: "(=>)",
      name: "operator.go.mod"
    },
    unquoted_string: { // Unquoted string
      match: "([^\\s/]|/(?!/))+",
      name: "string.unquoted.go.mod"
    },
    double_quoted_string: { // Interpreted string literals
      begin: "\"",
      beginCaptures: {
        0: {
          name: "punctuation.definition.string.begin.go.mod"
        }
      },
      end: "\"",
      endCaptures: {
        0: {
          name: "punctuation.definition.string.end.go.mod"
        }
      },
      name: "string.quoted.double",
      patterns: [
        {
          include: "#string_escaped_char"
        },
        {
          include: "#string_placeholder"
        }
      ]
    },
    raw_quoted_string: { // Raw string literals
      begin: "`",
      beginCaptures: {
        0: {
          name: "punctuation.definition.string.begin.go.mod"
        }
      },
      end: "`",
      endCaptures: {
        0: {
          name: "punctuation.definition.string.end.go.mod"
        }
      },
      name: "string.quoted.raw",
      patterns: [
        {
          include: "#string_placeholder"
        }
      ]
    },
    semver: { // Semver version strings (v1.2.3)
      match: "v(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-[\\da-z-]+(?:\\.[\\da-z-]+)*)?(?:\\+[\\da-z-]+(?:\\.[\\da-z-]+)*)?",
      name: "constant.language.go.mod"
    },
    semver_range: {
      begin: "\\[",
      patterns: [
        {
          include: "#semver"
        }
      ],
      end: "\\]"
    },
    string_escaped_char: {
      patterns: [
        {
          match: "\\\\([0-7]{3}|[abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})",
          name: "constant.character.escape.go.mod"
        },
        {
          match: "\\\\[^0-7xuUabfnrtv\\'\"]",
          name: "invalid.illegal.unknown-escape.go.mod"
        }
      ]
    },
    string_placeholder: {
      patterns: [
        {
          match: "%(\\[\\d+\\])?([\\+#\\-0\\x20]{,2}((\\d+|\\*)?(\\.?(\\d+|\\*|(\\[\\d+\\])\\*?)?(\\[\\d+\\])?)?))?[vT%tbcdoqxXUbeEfFgGsp]",
          name: "constant.other.placeholder.go.mod"
        }
      ]
    },
    invalid: { // invalid
      match: ".*",
      name: "invalid.illegal.unknown.go.mod"
    }
  }
};

const redisHighlighter: LanguageRegistration = {
  name: "redis",
  scopeName: "source.redis",
  patterns: [
    {
      include: "#comments"
    },
    {
      include: "#main"
    },
  ],
  repository: {
    comments: {
      patterns: [
        {
          begin: "(^[ \\t]+)?(?=--)",
          end: "(?!\\G)",
          patterns: [
            {
              name: "comment.line.double-dash.redis",
              begin: "--",
              end: "\\n",
              beginCaptures: {
                0: {
                  name: "punctuation.definition.comment.redis"
                }
              }
            }
          ],
          beginCaptures: {
            1: {
              name: "punctuation.whitespace.comment.leading.redis"
            }
          }
        },
        {
          begin: "(^[ \\t]+)?(?=#)",
          end: "(?!\\G)",
          patterns: [
            {
              name: "comment.line.number-sign.redis",
              begin: "#",
              end: "\\n",
              beginCaptures: {
                0: {
                  name: "punctuation.definition.comment.redis"
                }
              }
            }
          ],
          beginCaptures: {
            1: {
              name: "punctuation.whitespace.comment.leading.redis"
            }
          }
        },
        {
          name: "comment.block.redis",
          begin: "/\\*",
          end: "\\*/",
          captures: {
            0: {
              name: "punctuation.definition.comment.redis"
            }
          }
        }
      ]
    },
    main: {
      patterns: [
        {
          match: "(\\w+)\\s+(.*)",
          captures: {
            1: {
              name: "keyword.redis"
            },
            2: {
              patterns: [
                {
                  include: "#arguments"
                }
              ]
            }
          }
        },
      ]
    },
    arguments: {
      patterns: [
        {
          name: "keyword.other.redis",
          match: "\\b(?i:MATCH|NX|EX|XX|PX|WITHSCORES|GET|KEEPTTL|CH|INCR|DECR|LIMIT|BY|STORE|COUNT|AGGREGATE|WEIGHTS|ALPHA|REV|RESETSTAT|RESET|BEFORE|AFTER|COPY|REPLACE|IDLETIME|FREQ|ASC|DESC)\\b"
        },
        {
          name: "constant.numeric.redis",
          match: "\\b\\d+\\b|\\b(?i:MIN|MAX)\\b|\\B(?i:[+-]?INF)\\b"
        },
        {
          name: "keyword.operator.star.redis",
          match: "\\*"
        },
        {
          include: "#double_quoted_string"
        },
        {
          include: "#single_quoted_string"
        },
        {
          include: "#unquoted_string"
        }
      ]
    },
    unquoted_string: { // Unquoted string
      match: "[^\\s]+",
      name: "string.unquoted.redis"
    },
    double_quoted_string: { // Interpreted string literals
      begin: "\"",
      beginCaptures: {
        0: {
          name: "punctuation.definition.string.begin.redis"
        }
      },
      end: "\"",
      endCaptures: {
        0: {
          name: "punctuation.definition.string.end.redis"
        }
      },
      name: "string.quoted.single",
      patterns: [
        {
          include: "#string_escaped_char"
        },
        {
          include: "#string_placeholder"
        }
      ]
    },
    single_quoted_string: { // Interpreted string literals
      begin: "'",
      beginCaptures: {
        0: {
          name: "punctuation.definition.string.begin.redis"
        }
      },
      end: "'",
      endCaptures: {
        0: {
          name: "punctuation.definition.string.end.redis"
        }
      },
      name: "string.quoted.single",
      patterns: [
        {
          include: "#string_escaped_char"
        },
        {
          include: "#string_placeholder"
        }
      ]
    },
    string_escaped_char: {
      patterns: [
        {
          match: "\\\\([0-7]{3}|[abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})",
          name: "constant.character.escape.redis"
        },
        {
          match: "\\\\[^0-7xuUabfnrtv\\'\"]",
          name: "invalid.illegal.unknown-escape.redis"
        }
      ]
    },
    string_placeholder: {
      patterns: [
        {
          match: "%(\\[\\d+\\])?([\\+#\\-0\\x20]{,2}((\\d+|\\*)?(\\.?(\\d+|\\*|(\\[\\d+\\])\\*?)?(\\[\\d+\\])?)?))?[vT%tbcdoqxXUbeEfFgGsp]",
          name: "constant.other.placeholder.redis"
        }
      ]
    }
  },
}

const vcardHighlighter: LanguageRegistration = {
  name: "vcard",
  scopeName: "source.vcard",
  patterns: [
    {
      name: "support.function.vcard",
      begin: "^BEGIN:VCARD$",
      end: "^END:VCARD$",
      patterns: [
        { include: "#versionNum" },
        { include: "#properties" },
        { include: "#extensionProperties" },
        { include: "#attributeTypes" },
        { include: "#attributeValues" },
        { include: "#values" },
        { include: "#valuesMultiline" }
      ]
    }
  ],
  repository: {
    versionNum: {
      patterns: [{
        name: "variable.language.version.vcard",
        match: "(?<=^VERSION:).+$"
      }]
    },
    properties: {
      patterns: [{
        name: "keyword.control.property.vcard",
        match: "^\\b(VERSION|ADR|AGENT|ANNIVERSARY|BDAY|CALADRURI|CALURI|CATEGORIES|CLASS|CLIENTPIDMAP|EMAIL|FBURL|FN|GENDER|GEO|IMPP|KEY|KIND|LABEL|LANG|LOGO|MAILER|MEMBER|N|NAME|NICKNAME|NOTE|ORG|PHOTO|PRODID|PROFILE|RELATED|REV|ROLE|SORT-STRING|SOUND|SOURCE|TEL|TITLE|TZ|UID|URL|XML)\\b"
      }]
    },
    extensionProperties: {
      patterns: [{
        name: "keyword.other.expansion.property.vcard",
        match: "^\\S.*?(?=:)"
      }]
    },
    attributeTypes: {
      patterns: [{
        name: "entity.name.type.attribute.vcard",
        match: "(?<=;)\\b\\w+?\\b(?=[:;=])"
      }]
    },
    attributeValues: {
      patterns: [{
        name: "variable.attribute.vcard",
        match: "(?<=\\=).+?(?=[:;])"
      }]
    },
    values: {
      patterns: [{
        name: "string.unquoted.value.vcard",
        match: "(?<=:).+"
      }]
    },
    valuesMultiline: {
      patterns: [{
        name: "string.unquoted.value.vcard",
        match: "^ \\S.*"
      }]
    }
  }
};

const highlighters: LanguageRegistration[] = [
  gitAttributesHighlighter,
  goModHighlighter,
  redisHighlighter,
  vcardHighlighter,
];

export default highlighters;