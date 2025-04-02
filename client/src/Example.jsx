import { categoryList } from "./constants";
import Listcomponent from "./Listcomponent";

const Example = () => {
  return (
    <div>
      <Listcomponent
        data={categoryList}
        renderItem={(user) => <ExampleItem key={user.id} item={user} />}
      />
    </div>
  );
};

const ExampleItem = ({ item }) => {
  return <p>{item.label}</p>;
};

export default Example;
