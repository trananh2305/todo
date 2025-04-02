import { useContext, useMemo } from "react";
import FilterList from "./FilterList";
import CategoryList from "./CategoryList";
import { TodoContext } from "../Contexts/TodoProvider";
const FilterPanel = () => {
  const {
    listItem,
    selectedFilterId,
    setSelectedFilterId,
    searhText,
    setSearchText,
  } = useContext(TodoContext);
  const countByFilterIteam = useMemo(() => {
    return listItem.reduce(
      (acc, cur) => {
        let newAcc = { ...acc };
        if (cur.isImportant) {
          newAcc = { ...newAcc, important: newAcc.important + 1 };
        }
        if (cur.isComplete) {
          newAcc = { ...newAcc, completed: newAcc.completed + 1 };
        }
        if (cur.isDeleted) {
          newAcc = { ...newAcc, deleted: newAcc.deleted + 1 };
        }
        return newAcc;
      },
      {
        all: listItem.length,
        important: 0,
        completed: 0,
        deleted: 0,
      }
    );
  }, [listItem]);
  console.log({ countByFilterIteam });
  return (
    <div className="flex-1 flex-col flex gap-2 box-border p-0 ">
      <input
        type="text"
        className=" rounded-lg border w-[70%] px-2 focus:outline-0 focus:ring-1  focus:ring-gray-300  "
        placeholder="Search"
        value={searhText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      <FilterList
        selectedFilterId={selectedFilterId}
        setSelectedFilterId={setSelectedFilterId}
        countByFilterIteam={countByFilterIteam}
      />
      <CategoryList listItem={listItem} />
    </div>
  );
};

export default FilterPanel;
