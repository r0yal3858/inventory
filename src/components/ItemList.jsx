import "./ItemList.css";
import { useEffect, useState } from "react";
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
  let [display, setDisplay] = useState(0);
  let [email, setEmail] = useState("");
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
      let response = await sendEmail(str, email);
      setEmail(email);
      setDisplay(1);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.ctrlKey && (event.key == "f" || event.key == "F")) {
        document.getElementById("search").focus();
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleEsc);
  }, []);
  let display2 = (
    <div className="wrapping">
      <div>
        <h1>Atomic Wings Inventory</h1>
        <h2>980 2nd avenue</h2>
        <input
          placeholder="Enter Email Address"
          id="email"
          className="emailInput"
          type="email"
        />
        {error && error.length > 0 && <p>{error}</p>}
      </div>
      <button onClick={() => sendList()}>Send List</button>
      <input
        id="search"
        type="text"
        placeholder="type in to search"
        className="searchBar"
        onChange={(e) => {
          let itemName = e.target.value;
          if (itemName.length > 0) {
            let inv = {};
            Object.keys(inventory).map((group) => {
              inventory[group] = inventory[group].filter((item) => {
                return item.name.includes(itemName);
              });

              if (inventory[group].length > 0) {
                inv[group] = [...inventory[group]];
              }
            });
            setInventory({ ...inv });
          } else {
            setInventory({ ...items });
          }
        }}
      />
      {Object.keys(inventory).map((group) => (
        <div key={group} className="itemGroup">
          <h1>{group}</h1>
          <div className="itemList">
            {inventory[group].map((item) => (
              <div key={item.code}>
                <div className="item">
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
                    <input
                      type="number"
                      value={item.quantity}
                      min="0"
                      max="100"
                      onChange={(e) => {
                        let quantity = e.target.value;
                        if (!quantity) {
                          quantity = 0;
                        }
                        if (quantity < 0 || quantity > 100) {
                          console.log("not in range");
                          quantity = 0;
                          document.getElementById(
                            `${item.code}_error`
                          ).innerHTML =
                            "item quantity must be in between 0 & 100";
                          setTimeout(() => {
                            document.getElementById(
                              `${item.code}_error`
                            ).innerHTML = "";
                          }, 5000);
                        }
                        item.quantity = quantity;
                        setInventory({ ...inventory });
                      }}
                      className="quantityInput"
                      placeholder="0"
                    />

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
                <p id={`${item.code}_error`}>{""}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  let display3 = (
    <div>
      <p>invenory list has been sent to this email</p>
      <p>{email}</p>
    </div>
  );
  let arr = [display2, display3];
  return arr[display];
};
