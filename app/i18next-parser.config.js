export default {
  locales: ["en", "ja"],
  output: "public/locales/$LOCALE/translation.json",
  input: ["src/**/*.{ts,tsx}"],
  // allow keys to be phrases having `:`, `.`
  namespaceSeparator: false,
  keySeparator: false,
  keepRemoved: true,
};
