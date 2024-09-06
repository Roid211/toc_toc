const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 4444 });

// Define un conjunto de chistes Knock Knock en español
const chistes = [
  {
    contexto: "imagina que eres un adivino",
    setup:
      "¡Puf! ¡Pues vaya qué mentiroso es este adivino! Ni siquiera puede adivinar quiénes somos.",
    punchline: "",
  },
  {
    setup: "Naranja",
    punchline: "Naranja tú, ¡qué suerte!",
  },
  {
    setup: "Ato",
    punchline: "Ato no lo esperaba.",
  },
  // Puedes agregar más chistes aquí
];

server.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Elegir un chiste aleatorio
  const index = Math.floor(Math.random() * chistes.length);
  const chiste = chistes[index];
  let estado = 0; // Estado de la conversación

  if (index == 0) {
    socket.send(`${chiste.contexto}`);
  }

  // Iniciar el chiste
  socket.send("Toc toc");

  socket.on("message", (message) => {
    const msg = message.toString().trim().toLowerCase(); // Normalizar mensaje

    if (
      estado === 0 &&
      (msg === "¿quién es?" ||
        msg === "quién es" ||
        msg === "quién es?" ||
        msg === "¿quien es?" ||
        msg === "quien es" ||
        msg === "quien es?")
    ) {
      socket.send(`-${msg}`);
      socket.send(chiste.setup);

      estado = 1; // Avanzar al siguiente estado
    } else if (
      estado === 1 &&
      (msg === `${chiste.setup.toLowerCase()} quién?` ||
        msg === `${chiste.setup.toLowerCase()} quién` ||
        msg === `${chiste.setup.toLowerCase()} quien?` ||
        msg === `${chiste.setup.toLowerCase()} quien`)
    ) {
      socket.send(chiste.punchline);
      estado = 2; // Avanzar al estado final
    } else if (estado === 2) {
      socket.send("¡Gracias por leer :D !");
      socket.close(); // Cerrar la conexión después de contar el chiste
    } else {
      socket.send(`${msg}`);
      socket.send(
        "estamos jugando knock knock, utiliza '¿Quién es?` `o el nombre del chiste` quién?"
      );
    }
  });

  socket.on("close", () => {
    console.log("Cliente desconectado");
  });
});

console.log("Servidor WebSocket escuchando en el puerto 4444");
