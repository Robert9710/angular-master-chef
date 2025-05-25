import express from "express";
import cors from "cors";
import fs from "fs";

// const date = new Date();
// fs.copyFile(
//   "./server/data/Recipes.json",
//   `./server/data/Backup${date.getDate()}${date.getMonth() + 1}.json`,
//   (err) => {}
// );

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const FILES = {
  recipes: { fileName: "Recipes", locked: false },
  personalMenu: { fileName: "PersonalMenu", locked: false },
};

app.get("/menu/all", async (req, res) => {
  res.json(await getRecipesForCourse("all"));
});

app.get("/menu/courses", async (req, res) => {
  res.json(await getCourses());
});

app.get("/menu/:courseId", async (req, res) => {
  res.json(await getRecipesForCourse(req.params.courseId));
});

app.get("/menu/:courseId/:recipeId", async (req, res) => {
  res.json(await getRecipe(req.params.recipeId));
});

app.post("/menu/add/recipe", async (req, res) => {
  const menuData = await getData(FILES.recipes.fileName);
  let id = 0;
  menuData.forEach((course) => {
    course.recipes.forEach((recipe) => {
      if (parseInt(recipe.id) > id) {
        id = recipe.id;
      }
    });
  });
  menuData.forEach((course) => {
    if (course.id === req.body.courseId) {
      course.recipes.push({
        id: (++id).toString(),
        name: req.body.recipeName,
        instructions: { ...req.body.instructions },
      });
    }
  });
  updateData(FILES.recipes.fileName, menuData);
  res.status(204).send();
});

app.get("/user/:userName/bookmarks", async (req, res) => {
  res.json(await getUserMenu(req.params.userName));
});

app.post("/menu/recipe/:recipeId/bookmark", async (req, res) => {
  await addRecipeToUserMenu(req.body.userName, req.params.recipeId);
  res.json(await getUserMenu(req.params.userName));
});

app.delete("/user/:userName/bookmark/:bookmarkId", async (req, res) => {
  await removeRecipeFromUserMenu(req.params.userName, req.params.bookmarkId);
  res.json(await getUserMenu(req.params.userName));
});

function getData(fileName) {
  return new Promise((res, rej) => {
    if (!isFileLocked(fileName)) {
      fs.readFile(`./server/data/${fileName}.json`, (err, data) => {
        res(JSON.parse(data));
      });
    } else {
      res(setTimeout(getData, 100, fileName));
    }
  });
}

function isFileLocked(fileName) {
  return Object.keys(FILES).find(
    (file) => file.fileName === fileName && file.locked
  );
}

function toggleFileLock(fileName, lockFile) {
  Object.keys(FILES).forEach((file) => {
    if (file.fileName === fileName) {
      file.locked = lockFile;
    }
  });
}

function updateData(fileName, menuData) {
  return new Promise((res, rej) => {
    fs.writeFile(
      `./server/data/${fileName}.json`,
      JSON.stringify(menuData),
      (err) => {
        res();
      }
    );
  });
}

async function getRecipe(recipeId) {
  const menuData = await getData(FILES.recipes.fileName);
  for (const course of menuData) {
    for (const recipe of course.recipes) {
      if (recipe.id === recipeId) {
        return recipe;
      }
    }
  }
}

async function getRecipesForCourse(courseId) {
  const menuData = await getData(FILES.recipes.fileName);
  if (courseId === "all") {
    let response = [];
    menuData.forEach((course) => (response = response.concat(course.recipes)));
    return response;
  } else {
    return menuData.find((course) => course.id === courseId)?.recipes;
  }
}

async function getRecipesNamesForCourse(courseId) {
  const menuData = await getData(FILES.recipes.fileName);
  if (courseId === "all") {
    let response = [];
    menuData.forEach(
      (course) =>
        (response = response.concat(
          course.recipes.map((recipe) => recipe.name)
        ))
    );
    return response;
  } else {
    const recipes = menuData.find((course) => course.id === courseId)?.recipes;
    return recipes.map((recipe) => recipe.name);
  }
}

async function getCourses() {
  const menuData = await getData(FILES.recipes.fileName);
  return menuData.map((course) => ({
    courseId: course.id,
    courseName: course.course,
  }));
}

async function getUserMenu(userName) {
  const data = await getData(FILES.personalMenu.fileName);
  return data.find((userData) => userData.userName === userName);
}

async function updateUserMenu(userName, userMenu) {
  return new Promise(async (res, rej) => {
    const data = await getData(FILES.personalMenu.fileName);
    let userDataIndex = data.findIndex(
      (userData) => userData.userName === userName
    );
    if (userDataIndex !== -1) {
      data[userDataIndex] = userMenu;
    } else {
      data.push(userMenu);
    }
    fs.writeFile(
      `./server/data/${FILES.personalMenu.fileName}.json`,
      JSON.stringify(data),
      (err) => {
        res();
      }
    );
  });
}

async function addRecipeToUserMenu(userName, recipeId) {
  let userMenu = await getUserMenu(userName);
  const menuData = await getData(FILES.recipes.fileName);
  if (!userMenu) {
    userMenu = { userName, items: [] };
  }
  const isDuplicateRecipeId =
    userMenu.items.length > 0 &&
    userMenu.items.find((item) => item.recipeId === recipeId);
  if (!isDuplicateRecipeId) {
    menuData.forEach((course) => {
      const recipeData = course.recipes.find(
        (recipe) => recipe.id === recipeId
      );
      if (recipeData) {
        let id =
          userMenu.items.length > 0
            ? userMenu.items[userMenu.items.length - 1].id
            : -1;
        userMenu.items.push({
          id: (++id).toString(),
          courseId: course.id,
          courseName: course.course,
          recipeId: recipeData.id,
          recipeName: recipeData.name,
        });
      }
    });
    await updateUserMenu(userName, userMenu);
  }
}

async function removeRecipeFromUserMenu(userName, id) {
  const userMenu = await getUserMenu(userName);
  const itemIndex = userMenu.items.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    userMenu.items.splice(itemIndex, 1);
  }
  await updateUserMenu(userName, userMenu);
}
app.use(express.static(process.cwd() + "/dist/angular-master-chef/browser"));
app.listen(process.env["PORT"] || 3000);
