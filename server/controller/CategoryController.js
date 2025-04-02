import Category from "../model/categoryModel.js";

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({
        success: true,
        categories: allCategories
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required!" });
    }

    const availableCategory = await Category.findOne({ categoryName });

    if (availableCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }

    const category = await Category.create({ categoryName });

    if (category) {
      res.status(201).json({
        success: true,
        newCategory: category
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { getAllCategories, createCategory };
