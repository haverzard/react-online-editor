export const EXPORT_KEYWORD_REGEX = /exports\.[a-zA-Z]*[a-zA-Z0-9_-]*/g;

export const EXPORT_MODULE_GETTER_REGEX = /exports\.([a-zA-Z]*[a-zA-Z0-9_-]*)/;

export const REQUIRE_KEYWORD_REGEX = /require\("[^"]*"\)/g;

export const REQUIRE_MODULE_GETTER_REGEXES = [/require\("([^".]*)"\)/, /require\("\.\/([^"]*)"\)/];
