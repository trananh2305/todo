import { createContext, useState } from "react";
export const TodoContext = createContext();
const TodoProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedFilterId, setSelectedFilterId] = useState("all");
  const [activeTodoItemId, setActiveTodoItemId] = useState();
  const [searchText, setSearchText] = useState("");
  const [showSideBar, setShowSideBar] = useState(false);
  const [listItem, setListItem] = useState([
    {
      id: 1,
      name: "di hoc ",
      isImportant: true,
      isComplete: true,
      isDeleted: false,
      category: "personal",
    },
    {
      id: 2,
      name: "di choi ",
      isImportant: false,
      isComplete: false,
      isDeleted: false,
      category: "personal",
    },
    {
      id: 3,
      name: "di ngu ",
      isImportant: true,
      isComplete: true,
      isDeleted: false,
      category: "personal",
    },
  ]);
  return (
    <TodoContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        listItem,
        setListItem,
        selectedFilterId,
        setSelectedFilterId,
        activeTodoItemId,
        setActiveTodoItemId,
        searchText,
        setSearchText,
        showSideBar,
        setShowSideBar,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
