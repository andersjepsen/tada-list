module.exports = {
  client: {
    service: {
      name: "tada-list-service",
      localSchemaFile: "./generated/schema.graphql",
    },
    includes: ["./pages/**/*.tsx", "./components/**/*.tsx", "./ui/**/*.tsx"],
  },
};
