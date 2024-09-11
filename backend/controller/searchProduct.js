const Product = require("../models/productModel");

const searchProduct = async (req, res) => {
  try {
    const query = req.query.q;
    //console.log(query)
    const regex = new RegExp(query, 'i', 'g');
    console.log("Regex used:", regex);
    const product = await Product.find({
      "$or": [
        {
          productName: regex,
        },
        {
          category: regex,
        },
      ],
    });
    console.log("Search Results:", product);
    res.json({ message: "Search Results", error: false, success: true, data: product });
  } catch (error) {
    res.json({ message: error.message || error, error: true, success: false });
  }
};
module.exports = searchProduct;
