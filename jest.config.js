module.exports = {
    roots: [
        "<rootDir>/tests"
    ],
    testRegex: "tests/(.+)\\.Test\\.(jsx?|tsx?)$",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.jest.json"
        }
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    coverageDirectory: "tests/reports",
    testTimeout: 600000
};