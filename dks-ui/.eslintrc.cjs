module.exports = {
  plugins: [
    "wdio"
  ],
  extends: [
    "next/core-web-vitals",
    "plugin:wdio/recommended"
  ],
  overrides: [
    {
      files: ["src/**/*.test.tsx"],
      "rules": {
        "wdio/await-expect": "off"
      }
    }
  ]
};
