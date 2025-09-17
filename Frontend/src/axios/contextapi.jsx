import { createContext } from "react";

export const UserData = createContext();

export const UserDataProvider = ({children}) => {
  const name= JSON.parse(localStorage.getItem("user"));
  return <UserData.Provider value={name}>
    {children}
  </UserData.Provider>
}