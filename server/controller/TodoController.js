import Todo from "../model/todoModel.js";

const getAllTodo = async (req, res) => {
  try {
    const allTodo = await Todo.find();
    res.status(200).json({
      success: true,
      todo: allTodo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTodoById = async (req, res) => {
  try {
    // res.params để lấy param từ api
    const todoId = req.params.id;
    if (!todoId) {
      return res.status(400).json({ message: "TodoId not valid!" });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(400).json({ message: "Todo not exists!" });
    }

    res.status(200).json({
      success: true,
      todo: todo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const todo = req.body;
    if (!todo) {
      return res.status(404).json({ message: "Todo not valid!" });
    }
    if (!todo.name) {
      return res.status(400).json({ message: "Todo name not valid!" });
    }

    const newTodo = await Todo.create(todo);

    if (newTodo) {
      res.status(201).json({
        success: true,
        newTodo: newTodo,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "TodoId not valid!" });
    }

    await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Update successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "TodoId not valid!" });
    }

    await Todo.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Delete successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { getAllTodo, getTodoById, createTodo, deleteTodo, updateTodo };
