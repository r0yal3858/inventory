import "./ItemList.css";
import { useState } from "react";
import { items } from "../inventorylist";
import sendEmail from "../email";
let checkEmail = (email) => {
  try {
    if (typeof email != "string") throw "invalid email format";
    if (email.length < 1) throw "email address cannot be empty";
    email = email.trim();
    if (email.length < 1) throw "email address cannot be empty";
    let [user, ending] = email.split("@");
    let [subdomain, domain] = ending.split(".");
    if (user.length < 1 || subdomain.length < 1 || domain.length < 1)
      throw "invalid email";
    return { valid: 1, data: email };
  } catch (e) {
    return { valid: 0, data: e };
  }
};
export const ItemList = () => {
  let [inventory, setInventory] = useState({ ...items });
  let [error, setError] = useState("");

  const sendList = async () => {
    let str = "";
    let email = document.getElementById("email").value;
    email = checkEmail(email);
    if (!email.valid) {
      setError(email.data);
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    } else {
      email = email.data;
    }
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
      await sendEmail(str, email);
    }
  };
  return (
    <>
      <h1>Atomic Wings Inventory</h1>
      <h2>980 2nd avenue</h2>
      <input
        placeholder="Enter Email Address"
        id="email"
        className="emailInput"
      />
      {error && error.length > 0 && <p>{error}</p>}
      <button onClick={() => sendList()}>Send List</button>
      {Object.keys(inventory).map((group) => (
        <div key={group} className="itemGroup">
          <h1>{group}</h1>
          <div className="itemList">
            {inventory[group].map((item) => (
              <div key={item.code} className="item">
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
    </>
  );
};
