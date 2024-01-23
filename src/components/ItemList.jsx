import "./ItemList.css";
import { useState } from "react";
import { items } from "../inventorylist";
import sendEmail from "../email";
export const ItemList = () => {
  let [inventory, setInventory] = useState({ ...items });
  let [error, setError] = useState("");
  const sendList = async () => {
    let str = "";

    Object.keys(inventory).map((group) => {
      inventory[group].map((item) => {
        if (item.quantity > 0) {
          str += `${item.quantity} - ${item.name} - ${item.code}\n`;
        }
      });
    });
    if (str.length < 1) {
      setError("atleast one item must be added to the list");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      console.log(str);
      await sendEmail(str);
    }
  };
  return (
    <>
      <h1>Atomic Wings Inventory</h1>
      <h2>980 2nd avenue</h2>
      {error && error.length > 0 && <p>{error}</p>}
      <button onClick={() => sendList()}>sendList</button>
      {Object.keys(inventory).map((group) => (
        <div key={group} className="itemGroup">
          <h1>{group}</h1>
          <div className="itemList">
            {inventory[group].map((item) => (
              <div key={item.code}>
                <h2>{item.name}</h2>
                <div className="buttonGroup">
                  <button
                    onClick={() => {
                      item.quantity -= 1;

                      setInventory({ ...inventory });
                      console.log("decreasing");
                    }}
                    disabled={item.quantity < 1}
                  >
                    {"-"}
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    onClick={() => {
                      item.quantity += 1;
                      setInventory({ ...inventory });
                      console.log("increasing");
                    }}
                  >
                    {"+"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => sendList()}>sendList</button>
    </>
  );
};
