const { response } = require("express");
const express = require("express");
const { token } = require("morgan");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

//send infomation in the reques body in JSON format
app.use(express.json());

//create a new token for logging person details
morgan.token("personDetails", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    let result = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (tokens.method(req, res) === "POST") {
      console.log("morgan POST");
      result.push(tokens.personDetails(req, res));
    }

    return result.join(" ");
  })
);

//it allow for requests from all origins
//same-origin policy and cross-origin resource sharing(CORS)
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello Backend</h1>");
});
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  const numOfPeople = persons.length;
  console.log(Date());
  response.send(`<p>Phonebook has info for ${numOfPeople} people</p>
  <p>${Date()}</p>`);
});

//get a single phonebook entry
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  // console.log(id);
  const person = persons.find((p) => p.id === id);
  // console.log(person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//delete a single phonebook entry
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

//add a single phonebook entry
app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 10000);

  const body = request.body;
  // console.log(body);
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = { id: id, name: body.name, number: body.number };
  // persons.push(newPerson);
  persons = persons.concat(newPerson);
  response.send(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
