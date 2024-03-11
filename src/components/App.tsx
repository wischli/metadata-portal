import { Routes, Route, HashRouter } from "react-router-dom";
import { Chains } from "../scheme";
import Page from "./Page";
import { useEffect, useState } from "react";

export default function App() {
  const [chains, setChains] = useState({} as Chains);
  const [currentChain, setCurrentChain] = useState<string>("");
  const spec = chains[currentChain];

  useEffect(() => {
    fetch("data.json")
      .then((res) => res.json())
      .catch(() => {
        console.error(
          "Unable to fetch data file. Run `make collector` to generate it"
        );
      })
      .then(setChains);
  }, []);
  useEffect(() => {
    if (Object.keys(chains).length === 0 || currentChain) return;

    const locationChain = location.hash.replace("#/", "");
    const network =
      (Object.keys(chains).includes(locationChain) && locationChain) ||
      Object.keys(chains)[0];
    setCurrentChain(network);
  }, [chains]);

  useEffect(() => {
    if (currentChain) location.assign("#/" + currentChain);
  }, [currentChain]);

  if (!spec) return null;

  const chainsName = Object.keys(chains);
  const routes = chainsName.map((name) => (
    <Route
      key={name}
      path={name}
      element={<Page currentName={name} allChains={chains} />}
    />
  ));
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Page currentName={chainsName[0]} allChains={chains} />}
        />
        {routes}
      </Routes>
    </HashRouter>
  );
}
