const fs = require("fs");
const copyFile = (file, dir2) => {
  //include the fs, path modules
  var fs = require("fs");
  var path = require("path");

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, f));
  source.pipe(dest);
  source.on("end", function () {
    // console.log("Succesfully copied");
  });
  source.on("error", function (err) {
    console.log(err);
  });
};

async function moveFiles(path) {
  const dir = await fs.promises.opendir(path);
  fs.rmSync("../../db-dist/node_modules", { recursive: true, force: true });
  for await (const dirent of dir) {
    if (!(dirent.name === "src" || dirent.name === "scripts")) {
      copyFile(`./dist/${dirent.name}`, `../../db-dist/`);
    }
  }
  copyFile("./package.json", "../../db-dist/");
  copyFile("./.gitignore", "../../db-dist/");
  copyFile("./procfile", "../../db-dist/");
  copyFile("./src/prisma/schema.prisma", "../../db-dist/");

  copyFile("./src/privacy-policy.html", "../../db-dist/");
  copyFile("./src/download-app.html", "../../db-dist/");
  fs.cp(
    "./node_modules",
    "../../db-dist/node_modules",
    { recursive: true },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
  fs.cp("./dist/src", "../../db-dist/", { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  // fs.cp("./public", "../../db-dist/public", { recursive: true }, (err) => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
}
moveFiles("./dist").catch(console.error);
