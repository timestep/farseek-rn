import { useState, useCallback } from 'react';

export const useScryFall = () => {
  const [deck, setDeck] = useState([] as any);

  const removeCard = (card: any) => {
    console.log('id', deck[0].id, card.id);
    console.log('olddeck' , deck.length)
    const newDeck = deck.filter((c: any) => c.id !== card.id);
    console.log('newdeck', newDeck.length);
    setDeck(newDeck);
  };


  const getRandomCard = async () => {
    // GET https://api.scryfall.com/cards/random
    // ,
    try {
      const data = await Promise.all(
        [0,1,2,3,4].map(() => fetch('https://api.scryfall.com/cards/random')
          .then(r => r.json())
          .catch(error => ({ error }))
        )
      )
      setDeck(data);
      return data
    } catch (error) {
      console.log(error);
    }
  }

  const addCards = useCallback((direction: string) => async () => {
    // GET https://api.scryfall.com/cards/random
    // ,
    try {
      const data = await Promise.all(
        [0,1,2,3,4].map(() => fetch('https://api.scryfall.com/cards/random')
          .then(r => r.json())
          .catch(error => ({ error }))
        )
      )
      direction === 'end' ? setDeck([...deck, ...data]) : setDeck([...data, ...deck]);
      return data
    } catch (error) {
      console.log(error);
    }
  }, [deck])

  return {
    deck,
    removeCard,
    getRandomCard,
    addCards
  }
}