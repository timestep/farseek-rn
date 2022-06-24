import { useRef } from 'react';
import { Animated, Image, PanResponder, useWindowDimensions } from "react-native";

const MAX_HEIGHT = 500;
const RATIO_WIDTH = 2.5/3.5;

export const Card = ({
  card,
  onSwipe,
}: any) =>  {
  const pan = useRef(new Animated.ValueXY()).current;
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        console.log('gestureState', gestureState)
        if (gestureState.dx > 100 || gestureState.vx > 1) {
          console.log('swipe right')
          Animated.spring(pan, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: true,
            speed: 100,
          }).start(() => {
            onSwipe(card)
            pan.setValue({ x: 0, y: 0 })
            // remove card from list
          })
        } else if (gestureState.dx < -100 || gestureState.vx < -1) {
          console.log('swipe left')
          Animated.spring(pan, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: true,
            speed: 100,
          }).start(() => {
            onSwipe(card)
            pan.setValue({ x: 0, y: 0 })
            // remove card from list
          })
        } else {
          console.log('reset')
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }).start()
        }
        console.log('pan', pan)
      }
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX: pan.x }],
          width: RATIO_WIDTH * MAX_HEIGHT, 
          height: MAX_HEIGHT,
          marginTop: 10
        }
      ]}
      {...panResponder.panHandlers}
    >
      <Image 
        source={{uri:card.image_uris.normal}}
        style={{
          borderRadius: 20,
          flex: 1,
          resizeMode: "cover"
        }} 
      />
    </Animated.View>
  )
}