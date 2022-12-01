import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  connect(
    "mongodb+srv://Badea:Badea@cluster0.frksb2p.mongodb.net/FoodMine?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  ).then(
    () => console.log("Connect successfully"),
    (error) => console.log(error)
  );
};
