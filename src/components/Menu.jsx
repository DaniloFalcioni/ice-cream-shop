import React, { useEffect, useState } from "react";
import Gelato from "./Gelato";
import axios from "axios";
import data from "../fakeData";

const url = "https://react--course-api.herokuapp.com/api/v1/data/gelateria";

const Menu = () => {
   // caricamento errori fetching
   const [isError, setIsError] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // tutti i prodotti
   const [prodotti, setProdotti] = useState(data);

   // btn selector
   const [selected, setSelected] = useState(0);

   // prodotti filtrati
   const [filterProducts, setFilterProducts] = useState(prodotti);

   // categorie prodotti
   const [categorie, setCategorie] = useState([]);

   // categorie.unshift("all");

   const filtraProdotti = (categoria, index) => {
      setSelected(index);
      if (categoria === "all") {
         setFilterProducts(prodotti);
      } else {
         setFilterProducts(
            prodotti.filter((el) => (el.categoria === categoria ? el : "")),
         );
      }
   };

   // const getData = async () => {
   //    try {
   //       const response = await axios.get(url);
   //       setProdotti(response);
   //    } catch (error) {}
   // };

   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setIsError(false);
         try {
            const response = await axios.get(url);
            setProdotti(response.data.data);
            setFilterProducts(response.data.data);
            const nuoveCategorie = Array.from(
               new Set(response.data.data.map((el) => el.categoria)),
            );
            nuoveCategorie.unshift("all");
            setCategorie(nuoveCategorie);

            setIsLoading(false);
            setIsError(false);
         } catch (error) {
            setIsLoading(false);
            setIsError(true);
         }
      })();
   }, []);

   return (
      <div className="container">
         <h4 style={{ textAlign: "center", textTransform: "uppercase" }}>
            Le Nostre Scelte
         </h4>
         {
            //Se non sto caricando e non ci sono Errori
            !isLoading && !isError ? (
               <>
                  <div className="lista-categorie">
                     {categorie.map((categoria, index) => (
                        <button
                           className={`btn btn-selector ${
                              selected === index && "active"
                           }`}
                           key={index}
                           data-categoria={categoria}
                           onClick={() => filtraProdotti(categoria, index)}
                        >
                           {categoria}
                        </button>
                     ))}
                  </div>
                  <hr />
                  <div className="vetrina">
                     {filterProducts.map((el) => (
                        <Gelato key={el.id} {...el} />
                     ))}
                  </div>
               </>
            ) : //Se non sto caricando ma sono presenti errori
            !isLoading && isError ? (
               <h4
                  style={{
                     position: "absolute",
                     top: "50%",
                     left: "50%",
                     transform: "translate(-50%, -50%)",
                  }}
               >
                  Errore...
               </h4>
            ) : (
               <h4
                  style={{
                     position: "absolute",
                     top: "50%",
                     left: "50%",
                     transform: "translate(-50%, -50%)",
                  }}
               >
                  Loading...
               </h4>
            )
         }
      </div>
   );
};

export default Menu;
