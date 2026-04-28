import express from "express";
import { nanoid } from "nanoid";
import db from "./db.js";
import path from "path";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_, res) => {
  res.sendFile(path.join(import.meta.dirname, "/../views", "index.html"));
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  db.get<{ id: string; original: string }>(
    "SELECT original FROM urls WHERE id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).send({
          error: "Database error",
          message: err.message,
        });
      }
      if (row) {
        res.redirect(row.original);
      } else {
        res.status(404).send({
          error: "Not Found",
          message: "URL not found",
        });
      }
    }
  );
});

app.post("/shorten", (req, res) => {
  const originalUrl = req.body.url;

  const urlPattern = /^(https?:\/\/)/;
  if (!urlPattern.test(originalUrl)) {
    res.status(400).send({
      error: "Invalid URL",
      message: "URL must start with http:// or https://",
    });
    return;
  }

  const id = nanoid(6);

  db.run(
    "INSERT INTO urls (id, original) VALUES (?, ?)",
    [id, originalUrl],
    (err) => {
      if (err) {
        res.status(500).send({
          error: "Database error",
          message: err.message,
        });
        return;
      }
      res.send({
        shortUrl: `http://localhost:3000/${id}`,
      });
      return;
    }
  );
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
