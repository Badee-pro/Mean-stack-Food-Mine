import { Router } from "express";
// import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
const router = Router();

// router.get(
//   "/upload",
//   asyncHandler(async (req, res) => {
//     const foodsCount = await FoodModel.countDocuments();
//     if (foodsCount > 0) {
//       res.send("Upload is already done!");
//       return;
//     }

//     await FoodModel.create(sample_foods);
//     res.send("Upload Is Done!");
//   })
// );

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

// router.get(
//   "/autocomplete/:searchTerm",
//   asyncHandler(async (req, res) => {
//     const foods = await FoodModel.find();
//     res.send(foods);
//   })
// );

router.post("/getFoods", async (req, res) => {
  let payload = req.body.payload;
  console.log(payload);
  let search = await FoodModel.find({
    name: { $regex: new RegExp("^" + payload + ".*", "i") },
  }).exec();
  search = search.slice(0, 3);
  const foods = await FoodModel.aggregate(
    // { name: { $regex: searchRegex } }
    [
      {
        $search: {
          index: "autoComplete",
          autocomplete: {
            query: req.body.payload,
            path: "name",
            // fuzzy: {},
            fuzzy: {
              maxEdits: 1,
              prefixLength: 1,
            },
            tokenOrder: "sequential",
          },
        },
      },
      { $limit: 4 },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ]
  );

  res.send({ foods: search });
});

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.aggregate(
      // { name: { $regex: searchRegex } }
      [
        {
          $search: {
            // index: "seachFood",
            // text: {
            //   query: req.params.searchTerm,
            //   path: "name",
            //   fuzzy: {},
            // },
            index: "autoComplete",
            autocomplete: {
              query: req.params.searchTerm,
              path: "name",
              // fuzzy: {},
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1,
              },
              // fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
              tokenOrder: "sequential",
              // type: "autocomplete",
            },
          },
        },
        // { $limit: 4 },
        // {
        //   $project: {
        //     _id: 0,
        //     name: 1,
        //   },
        // },
      ]
    );

    res.send(foods);
  })
);

router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tag/:tagName",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

export default router;
