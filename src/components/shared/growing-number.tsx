import { useSpring, animated } from '@react-spring/web';

const GrowingNumber = ({ start, end }) => {
  const { number: numberValue } = useSpring({
    from: { number: start },
    number: end,
    config: { duration: 0.1 }
  });

  return (
    <animated.span>{numberValue.to((n: number) => n.toFixed(2))}</animated.span>
  );
};

export default GrowingNumber;
