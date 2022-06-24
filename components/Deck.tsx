
import {  Text, TextProps } from './Themed';
import { View, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Card } from './Card'
import { useScryFall } from '../hooks/useScryFall';

const MAX_HEIGHT = 500;
const RATIO_WIDTH = 2.5/3.5;

export const Deck = (props: TextProps) => {
  const { height } = useWindowDimensions();

  const {
    deck,
    getRandomCard,
    addCards,
    removeCard,
  } = useScryFall()

  const renderItem = ({item} : any) => <Card card={item} onSwipe={removeCard}/>;

  const onViewRef = useRef(({viewableItems, changed}: any)=> {
    // console.log('viewableItems', Object.keys(viewableItems))
    // console.log('changed', changed)
    // Use viewable items in state or as intended
  })

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  useEffect(() => {
    getRandomCard();
  }, []);

  return deck.length > 0 ? (
    <View>
      <FlatList
        data={deck}
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
