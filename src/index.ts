import app from "./indexSetup";

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
