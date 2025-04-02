import { useContext, useMemo } from "react";
import { categoryList } from "../constants";
import { TodoContext } from "../Contexts/TodoProvider";
const CategoryList = (props) => {
  const { selectedCategory, setSelectedCategory } = useContext(TodoContext);

  const countByFilterCategory = useMemo(() => {
    return props.listItem.reduce(
      (acc, cur) => {
        let newAcc = { ...acc };
        if (cur.category === "personal") {
          newAcc = { ...newAcc, personal: newAcc.personal + 1 };
        } else if (cur.category === "company") {
          newAcc = { ...newAcc, company: newAcc.company + 1 };
        } else if (cur.category === "travel") {
          newAcc = { ...newAcc, travel: newAcc.travel + 1 };
        } else {
          newAcc = { ...newAcc, idea: newAcc.idea + 1 };
        }
        return newAcc;
      },
      {
        personal: 0,
        company: 0,
        travel: 0,
        idea: 0,
      }
    );
  }, [props.listItem]);
  return (
    <div className="p-3 border bg-slate-50 ">
      <div className=" flex justify-between border-b">
        <h4 className="mb-2 font-medium  px-2">Categories</h4>
        <h4 className="mb-2 font-medium  px-2">Quantity</h4>
      </div>
      {categoryList.map((category) => {
        return (
          <div
            className={`flex justify-between rounded py-1 px-2 mr-6 ${
              selectedCategory === category.id ? "bg-sky-500" : ""
            } `}
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
            }}
          >
            <p className="">{category.label}</p>
            <p>{countByFilterCategory[category.id]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
