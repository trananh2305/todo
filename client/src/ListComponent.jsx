const Listcomponent = ({ data, renderItem }) => {
  return (
    <div>
      {data.map((item) => {
        renderItem(item);
      })}
    </div>
  );
};

export default Listcomponent;
