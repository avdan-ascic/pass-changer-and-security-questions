import config from "./config"
import app from "./App"
import mongoose from "mongoose"

app.listen(config.port, err => {
  if (err) return console.log(err)
  console.log(`Server started on port ${config.port}`)
})

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongo)
  .then(() => console.log(`MongoDB connected succesfully..`))
  .catch(() => console.log(`Error connecting to MongoDB ${config.mongo}!`));
