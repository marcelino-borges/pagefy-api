export const styleModel = {
  backgroundColor: "#fff",
  backgroundImage: "https://www.url.com",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};

export const componentModel = {
  _id: "asd123asd-asd12asd",
  text: "Text",
  url: "https://www.url.com",
  style: styleModel,
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

export const pageModel = {
  userId: "asd12zxc2zq5q4w2eqe1czx",
  name: "Name",
  url: "/my-url",
  pageImageUrl: "https://www.url.com",
  isPublic: true,
  views: 15,
  style: styleModel,
  topComponents: [componentModel],
  middleComponents: [componentModel],
  bottomComponents: [componentModel],
  customScripts: {
    header: "let a = 1;",
    endBody: "let a = 1;",
  },
};

export const errorModel = {
  statusCode: 200,
  errorDetails: "Details of the error (if any)",
  message: "Summary of the result",
};

export const fileUploadFormDataModel = {
  userId: "9as9d9vjmav9m",
  userFolderName: "profile",
  pageId: "jica98vncu1-9010incv1",
};

export const userModel = {
  _id: "asd123asd-asd12asd",
  firstName: "John",
  lastName: "Doe",
  email: "example@email.com",
  profileImageUrl: "https://www.url.com",
};
