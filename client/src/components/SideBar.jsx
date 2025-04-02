import { useState } from "react";
import { categoryList } from "../constants";
const SideBar = (props) => {
  const data = props.todoItem;
  const [name, setName] = useState(data.name);
  const [isImportant, setIsImportant] = useState(data.isImportant);
  const [isComplete, setIsComplete] = useState(data.isComplete);
  const [category, setCategory] = useState(data.category);
  console.log(isComplete);

  // ham xu li luu du lieu
  const handleSave = () => {
    const newTodo = { ...data, name, isImportant, isComplete, category };
    props.handleChangeTodoItem(newTodo);
    props.setShowSideBar(false);
  };
  return (
    <div className="fixed bg-white top-0 bottom-0 right-0 w-[20%] shadow-lg shadow-slate-500 flex flex-col justify-between">
      <form action="">
        <div className="flex flex-col gap-2 items-start px-3">
          <lable htmlFor="sb-name"> What name</lable>
          <input
            id="sb-name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border border-gray-200 rounded-md px-2"
          />
        </div>
        <div className="flex flex-col gap-2 text-start items-start px-3">
          <lable htmlFor="sb-important"> Is Important</lable>
          <input
            id="sb-important"
            type="checkbox"
            name="important "
            checked={isImportant}
            onChange={() => {
              setIsImportant(!isImportant);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-start px-3">
          <lable htmlFor="sb-complete"> Is Complete</lable>
          <input
            id="sb-complete"
            type="checkbox"
            name="complete"
            checked={isComplete}
            onChange={() => {
              setIsComplete(!isComplete);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-start px-3">
          <lable htmlFor="sb-category"> What category</lable>
          <select name="category" id="sb-category" defaultValue={category} onChange={(e)=>{
            setCategory(e.target.value
            
            )
          }}>
            {categoryList.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.label}
                </option>
              );
            })}
          </select>
        </div>
      </form>
      <div className="flex justify-around p-4">
        <button
          className="  bg-blue-200 p-2 rounded-lg w-16 "
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="w-16 bg-red-300 p-2 rounded-lg"
          onClick={() => {
            props.setShowSideBar(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SideBar;
