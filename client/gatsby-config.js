module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `OpenTutor Home`,
    description: ``,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: [
          "GRAPHQL_ENDPOINT",
          "TUTOR_ENDPOINT",
          "ADMIN_ENDPOINT",
          "GOOGLE_CLIENT_ID",
          "API_SECRET",
        ],
      },
    },
    {
      resolve: "gatsby-plugin-material-ui",
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
        exclude: /(node_modules|.cache|public|static)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
  ],
};
