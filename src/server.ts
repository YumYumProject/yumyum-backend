// import express from "express";
// import connectToDatabase from "./database";

// import { newHandlerContent } from "./handlers/content";
// import { newRepositoryContent } from "./repositories/content";

// async function main() {
//   const app = express();
//   const PORT = 3000;
//   app.use(express.json());

//   const repoContent = newRepositoryContent(db);
//   const handlerContent = newHandlerContent(repoContent);

//   connectToDatabase().then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   });

//   console.log("Hello");

//   app.post(
//     "/content/",
//     handlerContent.getRecipesByFilter.bind(newHandlerContent)
//   );
// }

// main();
