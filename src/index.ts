import express from "express";

const app = express();

const port = process.env.PORT || 3000;

const HTTP_STATUSES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

const db = {
  courses: [
    { id: 1, title: "FRONT-END" },
    { id: 2, title: "BACK-END" },
    { id: 3, title: "FULLSTACK" },
  ],
};

app.get("/", (req, res) => {
  res.json({ message: "JSON method test" });
  // res.sendStatus(404);
});

app.get("/courses", (req, res) => {
  let foundCourses = db.courses;

  if (req.query.title) {
    foundCourses = foundCourses.filter((c) => {
      return c.title.includes(req.query.title as string);
    });
  }

  res.json(foundCourses);
});

app.get("/courses/:id", (req, res) => {
  const found = db.courses.find((c) => c.id === +req.params.id);

  if (!found) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND);

    return;
  }

  res.json(found);
});

app.post("/courses", (req, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST);

    return;
  }

  const course = {
    id: new Date().getTime(),
    title: req.body.title,
  };

  db.courses.push(course);

  res.status(HTTP_STATUSES.CREATED).json(course);
});

app.delete("/courses/:id", (req, res) => {
  db.courses = db.courses.filter((c) => c.id !== +req.params.id);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});

app.put("/courses/:id", (req, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST);

    return;
  }

  const found = db.courses.find((c) => c.id === +req.params.id);

  if (!found) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND);

    return;
  }

  found.title = req.body.title;

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
app.listen(port, () => {
  console.log("Server is UP!");
});
