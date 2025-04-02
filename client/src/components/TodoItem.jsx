const TodoItem = (props) => {
  const handleClick = () => {
    alert("có cái Đầu buồi ");
  };
  return (
    <div
      className="bg-white w-full px-[5px] py-[3px] rounded shadow-md mb-1 flex justify-between "
      onClick={() => props.handleClickItem(props.id)}
    >
      <div className="flex gap-1 ">
        <input
          type="checkbox"
          className=""
          checked={props.isComplete}
          onChange={() => {
            props.handleCompleteCheckBoxChange(props.id);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <p onClick={handleClick} className="w-auto">
          {props.name}
        </p>
      </div>

      {props.isImportant && <p>👌</p>}
    </div>
  );
};

export default TodoItem;
