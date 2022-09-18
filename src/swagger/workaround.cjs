const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/routes/index.ts"];

const exampleStyle = {
  backgroundColor: "#fff",
  backgroundImage: "https://www.url.com",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};

const exampleComponent = {
  _id: "asd123asd-asd12asd",
  text: "Text",
  url: "https://www.url.com",
  style: exampleStyle,
  visible: true,
  clicks: 15,
  layout: {
    type: {
      rows: 15,
      columns: 15,
    },
    required: true,
  },
  type: 15,
  mediaUrl: "http://www.youtube.com",
  iconDetails: {
    type: {
      rows: 15,
      columns: 15,
    },
  },
  visibleDate: "2022-01-01T22:11:25:000Z",
  launchDate: "2022-01-01T22:11:25:000Z",
  animation: {
    type: {
      name: "bounceIn",
      startDelay: 15,
      duration: 15,
      infinite: true,
    },
  },
};

const pageModel = {
  userId: "asd12zxc2zq5q4w2eqe1czx",
  name: "Name",
  url: "/my-url",
  pageImageUrl: "https://www.url.com",
  isPublic: true,
  views: 15,
  style: exampleStyle,
  topComponents: [exampleComponent],
  middleComponents: [exampleComponent],
  bottomComponents: [exampleComponent],
};

const errorModel = {
  statusCode: 000,
  errorDetails: "Details of the error (if any)",
  message: "Summary of the result",
};

const fileUploadFormData = {
  userId: "9as9d9vjmav9m",
  userFolderName: "profile",
  pageId: "jica98vncu1-9010incv1",
};

const doc = {
  info: {
    version: "1.0.0",
    title: "SocialBio API",
    description: "Service consumed by SocialBio frontend.",
  },
  host: "https://socialbio-api.onrender.com",
  basePath: "/",
  consumes: ["application/json"],
  definitions: {
    User: {
      _id: "asd123asd-asd12asd",
      firstName: "John",
      lastName: "Doe",
      email: "example@email.com",
      profileImageUrl: "https://www.url.com",
    },
    Page: pageModel,
    Error: errorModel,
    ImageUploadFormData: fileUploadFormData,
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
