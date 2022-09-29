import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
let id = 101;


function App() {

  const [inputVal, setInputVal] = useState();
  const [data, setData] = useState([]);
  const [checkEdit, setChekEdit] = useState(false);
  const [edit, setEdit] = useState(NaN);
  return (
    <div className="App">
     
     <h2> todositem List</h2>

<form
  onSubmit={function (e) {
    e.preventDefault();
  }}
>
  <input
    type="text"
    value={inputVal}
    onChange={function (e) {
      setInputVal(e.target.value);
    }}
  />
  <button
    onClick={function (e) {
      if (inputVal === "") {
        return;
      }
      const obj = {
        item: inputVal,
        id: id++,
        completed: false
      };
      if (checkEdit) {
        setData(
          data.map((ele) => {
            if (ele.id === edit) {
              return { ...ele, item: inputVal };
            }
            return ele;
          })
        );
        setChekEdit(false);
        setEdit(NaN);
      } else {
        setData([...data, obj]);
      }
      setInputVal("");
    }}
  >
    Add
  </button>
  <button
    onClick={function () {
      setData([]);
    }}
  >
    Clear All
  </button>
</form>
<ol>
  {data.map((obj) => {
    if (obj.completed) {
      obj.item = <del>{obj.item}</del>;
    }
    return (
      <div key={obj.id}>
        <li>{obj.item}</li>
        <button
          onClick={function () {
            let copyOfData = data.slice();
            for (let item of copyOfData) {
              if (item.id === obj.id) {
                item.completed = true;
              }
            }
            setData(copyOfData);
          }}
        >
          Mark
        </button>
        <button
          onClick={function () {
            const newData = data.filter((ele) => {
              return obj.id !== ele.id;
            });
            setData(newData);
          }}
        >
          Delete
        </button>
        <button
          onClick={function () {
            setInputVal(obj.item);
            setEdit(obj.id);
            setChekEdit(true);
          }}
        >
          Edit
        </button>
      </div>
    );
  })}
</ol>

    </div>
  );
}

export default App;
