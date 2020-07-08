import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'; 
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import  Button from 'react-bootstrap/Button';
import  Modal from 'react-bootstrap/Modal';


import '../../css/style.css';

import { getAllPokemon , getPokemon} from './pokemon';



function App(props) {
  const [ pokemon, setPokemon] =  useState ([]);
  const [pokemonShop, setPokemonShop] = useState([]);
  const [pokeShop, setPokeShop] = useState(false);
  const [pokeSearch, setPokeSearch] =  useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState('');
  const quantidad = 0;
  const iniUrl = 'https://pokeapi.co/api/v2/pokemon';
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    async function fetchData(){
      let response = await getAllPokemon(iniUrl);
      setNextUrl(response.next);
        setPrevUrl(response.previus);
        await loadingPokemon(response.results);
        setLoading(false);
        setPokeShop(false);
    }
    fetchData();
    
   }, [])
  
 
 
  const loadingPokemon = async data => {
    let poke = await Promise.all(
      data.map(async pokemon => {
        let pokemonRecord = await getPokemon(pokemon.url);
        console.log("pokemonRecord", pokemonRecord);
        return pokemonRecord;
    })
    );
    
    setPokemon(poke);
  }


  const next = async () => {
    setLoading(true);
    let data =  await getAllPokemon(nextUrl)
    await loadingPokemon(data.results)
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
 }

 const prev = async () => {
   if (!prevUrl) return;
   setLoading(true);
   let data =  await getAllPokemon(prevUrl)
   await loadingPokemon(data.results)
   setNextUrl(data.next);
   setPrevUrl(data.previous);
   setLoading(false);
}

   const shopPokemon = (pokemons) => {
     setPokemonShop(state => {
       const pokeExists = (state.filter(p => pokemons.id == p.id).length >0);
              
      if (!pokeExists) {
         state = [...state, pokemons];
         state.sort(function (a,b) {
           return a.id - b.id;
         })
       }
       
       return state;
     })
    
    getAllPokemon(iniUrl);
   }

   const removePokemon = (id) => {
     setPokemonShop(state => state.filter(p => p.id != id))
   }

  return(
      <div>
        
     
        <>
          <div className="nav-poke">
            <Navbar bg="blue" expand="lg">
              <Navbar.Brand href="/">Pokemón Store</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="search-poke"> 
                  <Form inline>
                  <FormControl type="text" placeholder="Insira o nome do Pokémon" className="mr-sm-2" />
                  <Link to="/Search" variant="primary" className="link-search" >Pesquisar</Link>
                 
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </div>

                <div className="container">

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-8" className="container-pokemon">
                        
                            <div className="btn">
                                <button  variant="primary" onClick={prev} className="prev-btn">Prev </button>
                                <button  variant="primary" onClick={next} className="next-btn">Next </button>
                            </div>
                            <CardDeck  className="pokemon-list">
                            { pokemon.map(poke => (
                                    <Card style={{ width: '11rem', height: '20rem' }} className="pokemon" key={poke.id} pokemon={poke} >
                                
                                        
                                        <Card.Img variant="top" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
                                                    + poke.id + ".png"} className="Img-pokemon" alt=""/>
                                            <Card.Body>
                                                <Card.Title> {poke.name}</Card.Title>
                                                <Card.Text>
                                                    <p>Preço: R${poke.id *4},00</p> 
                                                </Card.Text>
                                                <Button  onClick={()=> shopPokemon(poke)} className="catch-btn"  variant="primary">Comprar</Button>
                                            </Card.Body>      
                                    
                                    </Card >
                                ))}
                            </CardDeck>
                            <div className="btn">
                                <button variant="primary" onClick={prev} className="prev-btn">Prev </button>
                                <button variant="primary" onClick={next} className="next-btn">Next </button>
                            </div>

                        </div>
                    

                        <div class="col-6 col-md-4" >
                          <div className="carrinho">
                                <h1>  Carrinho  </h1>   
                                
                                <section className="pokeShop">
                                    <CardDeck className="pokemon-list-shop">
                                        {pokemonShop.map(poke => (
                                        <Card  className="pokeCatch-shop" key={poke.id} pokemon={poke} >

                                            <Card.Img variant="top" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
                                            + poke.id + ".png"} className="Img-pokemon-shop" alt=""/>
                                            
                                            <Card.Body>
                                                <Card.Title> {poke.name}</Card.Title>
                                                <Card.Text>
                                                    <p>Preço: R${poke.id *4},00</p> 
                                                </Card.Text>
                                                <Button  className="remove" onClick={ () => removePokemon(poke.id)}>&times; </Button>
                                            </Card.Body>

                                        </Card>

                                ))}
                                </CardDeck>



                                </section>
                                      <section>
                                          <Button variant="primary" onClick={handleShow}>
                                            Finalizar Compra
                                          </Button>

                                          <Modal show={show} onHide={handleClose} >
                                            <Modal.Header closeButton>
                                              <Modal.Title>Compra Finalizada.</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="finalizar"> 
                                              <h2>Parabéns! </h2>
                                              <h4>Compra Finalizada.</h4>
                                            </Modal.Body>
                                          </Modal>

                                      </section>
                                   
                                
                            </div>
                        </div>
                    </div>              
                </div>
        
        </>
           
      </div>
  
  )

}


export default  App;