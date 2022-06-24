
import {  Text, TextProps } from './Themed';
import { View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Card } from './Card'
import { useScryFall } from '../hooks/useScryFall';

export const SingleCardDeck = (props: TextProps) => {
  const {
    deck,
    getRandomCard,
    removeCard
  } = useScryFall()

  const [filteredCards, setFilteredCards] = useState([] as any)

  useEffect(() => {
    getRandomCard();
  }, []);

  useEffect(() => { 
    setFilteredCards(deck)
  }, [deck])

  console.log('length', deck && deck.length)

  const handleOnSwipe = useCallback((idx: number) => (card: any) => {
    console.log('cardid', card.id)
    setFilteredCards([...filteredCards, {...card}])
    console.log('filteredCards', filteredCards.length)
    console.log('deck', deck.length)
    console.log('idx', idx)
    if(idx === deck.length - 2) {
      console.log('hit end')
      getRandomCard();
    }
  }, [filteredCards, deck])

  // PROBLEM
  // THE DECK DOESNT ADD NEW CARDS

  return deck.length > 0 ? (
    <View>
      {deck.map((card: any, index: number) => (
        <Card 
          stack
          key={index} 
          card={card} 
          onSwipe={handleOnSwipe(index)} 
        />
      ))}
    </View>
  ): <Text {...props}>Loading...</Text>;
}
