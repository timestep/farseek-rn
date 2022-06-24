
import {  Text, TextProps } from './Themed';
import { View, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Card } from './Card'

const MAX_HEIGHT = 500;
const RATIO_WIDTH = 2.5/3.5;

export const Deck = (props: TextProps) => {
  const [cards, setCards] = useState([] as any);
  const { height } = useWindowDimensions();

  const removeCard = useCallback((card: any) => {
    setCards(cards.filter((c: any) => c !== card));
  }, [cards]);

  const renderItem = ({item} : any) => <Card card={item} onSwipe={removeCard}/>;

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
      setCards(data);
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
      direction === 'end' ? setCards([...cards, ...data]) : setCards([...data, ...cards]);
      return data
    } catch (error) {
      console.log(error);
    }
  }, [cards])

  const onViewRef = useRef(({viewableItems, changed}: any)=> {
    console.log('viewableItems', Object.keys(viewableItems))
    console.log('changed', changed)
    // Use viewable items in state or as intended
  })

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  useEffect(() => {
    getRandomCard();
  }, []);

  return cards.length > 0 ? (
    <View>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(card: any) => card.id}
        initialScrollIndex={2}
        onStartReached={addCards('start')}
        onEndReached={addCards('end')}
        onEndReachedThreshold={1.5}
        onStartReachedThreshold={10}
        showsVerticalScrollIndicator={false}
        contentOffset={{x: 0, y: height/2 - 25}}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  ): <Text {...props}>Loading...</Text>;
}
