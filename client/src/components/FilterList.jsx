import { Tally3, Flag, Check, Trash2 } from "lucide-react";
const listFilterItem = [
  {
    id: "all",
    lable: "All",
    iconPath: <Tally3 />,
  },
  {
    id: "important",
    lable: "Important",
    iconPath: <Flag />,
  },
  {
    id: "completed",
    lable: "Completed",
    iconPath: <Check />,
  },
  {
    id: "deleted",
    lable: "Deleted",
    iconPath: <Trash2 />,
  },
];
const FilterList = (props) => {
  return (
    <div className="grid grid-cols-2 gap-3 box-border  ">
      {listFilterItem.map((item) => {
        return (
          <div
            className={`flex justify-between rounded-lg hover:cursor-pointer p-3 ${
              item.id === props.selectedFilterId
                ? "bg-sky-700 text-white"
                : "bg-slate-100"
            }`}
            key={item.id}
            onClick={() => {
              props.setSelectedFilterId(item.id);
            }}
          >
            <div className="">
              <div className="">{item.iconPath}</div>
              <p>{item.lable}</p>
            </div>
            <p className="">{props.countByFilterIteam[item.id]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FilterList;
