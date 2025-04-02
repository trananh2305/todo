import { useContext, useMemo, useRef } from "react";
import TodoItem from "./components/TodoItem";
import SideBar from "./components/SideBar";
import FilterPanel from "./components/FilterPanel";
import { TodoContext } from "./Contexts/TodoProvider";

const App = () => {
  // const listItem = [
  //   {
  //     id: 1,
  //     name: "di hoc calon"
  //   },
  //   {
  //     id: 2,
  //     name: "di choi calon"
  //   },
  //   {
  //     id: 3,
  //     name: "di ngu calon"
  //   }
  // ];
  const {
    listItem,
    setListItem,
    setShowSideBar,
    showSideBar,
    setActiveTodoItemId,
    activeTodoItemId,
    searchText,
    selectedFilterId,
  } = useContext(TodoContext);
  // tat mo side bar

  // click vao item de mo side bar cho tung item
  const handleClickItem = (todoID) => {
    setShowSideBar(true);
    setActiveTodoItemId(todoID);
  };
  //
  const activeTodoItem = listItem.find((todo) => todo.id === activeTodoItemId);
  // useRef(): dung de tuong tac voi 1 phan tu trong DOM
  const inputRef = useRef();
  const handleAddItem = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      setListItem([
        ...listItem,
        {
          id: crypto.randomUUID(),
          name: value,
          isImportant: false,
          isComplete: false,
          category: "personal",
        },
      ]);
      // xu li gia tri cua input
      inputRef.current.value = "";
    }
  };

  const handleCompleteCheckBoxChange = (todoID) => {
    const newListItem = listItem.map((todo) => {
      if (todo.id === todoID) {
        return { ...todo, isComplete: !todo.isComplete };
      }
      return todo;
    });
    setListItem(newListItem);
  };
  // xu li thay doi noi dung item
  const handleChangeTodoItem = (newItem) => {
    const newListItem = listItem.map((todo) => {
      if (todo.id === newItem.id) {
        return newItem;
      }
      return todo;
    });
    setListItem(newListItem);
  };
  console.log(listItem);
  const { selectedCategory } = useContext(TodoContext);
  const filterItems = useMemo(() => {
    return listItem.filter((todo) => {
      if (!todo.name.includes(searchText)) {
        return false;
      }

      if (selectedCategory && selectedCategory !== todo.category) return false;

      if (selectedFilterId === "all") return true;
      else if (selectedFilterId === "important") return todo.isImportant;
      else if (selectedFilterId === "completed") return todo.isComplete;
      else return todo.isDeleted;
    });
  }, [listItem, selectedFilterId, searchText, selectedCategory]);

  return (
    <div className="flex pt-3">
      <FilterPanel />
      <div className="flex-[2] px-10 ">
        <input
          ref={inputRef}
          className="bg-white w-full px-[5px] py-[3px] rounded shadow-md mb-1 focus:outline-0 focus:ring-1  focus:ring-gray-300"
          type="text"
          name="add-new-task "
          placeholder="hehe"
          onKeyDown={handleAddItem}
        />
        {filterItems.map((todo) => {
          return (
            <TodoItem
              id={todo.id}
              name={todo.name}
              key={todo.id}
              isImportant={todo.isImportant}
              isComplete={todo.isComplete}
              isDeleted={todo.isDeleted}
              handleCompleteCheckBoxChange={handleCompleteCheckBoxChange}
              handleClickItem={handleClickItem}
            />
          );
        })}
        {showSideBar && (
          <SideBar
            key={activeTodoItemId}
            todoItem={activeTodoItem}
            handleChangeTodoItem={handleChangeTodoItem}
            setShowSideBar={setShowSideBar}
          />
        )}
      </div>
    </div>
  );
};

export default App;
