import { useNProgress } from '@tanem/react-nprogress';
import { PropsWithChildren } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
function Container({ animationDuration, children, isFinished }: PropsWithChildren<{
  animationDuration: number
  isFinished: boolean
}>) {
  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
function Bar({ animationDuration, progress }: {
  animationDuration: number
  progress: number
}) {
  return (
    <div
      style={{
        background: '#29d',
        height: 2,
        left: 0,
        marginLeft: `${(-1 + progress) * 100}%`,
        position: 'fixed',
        top: 0,
        transition: `margin-left ${animationDuration}ms linear`,
        width: '100%',
        zIndex: 1031,
      }}
    >
      <div
        style={{
          boxShadow: '0 0 10px #29d, 0 0 5px #29d',
          display: 'block',
          height: '100%',
          opacity: 1,
          position: 'absolute',
          right: 0,
          transform: 'rotate(3deg) translate(0px, -4px)',
          width: 100,
        }}
      />
    </div>
  );
}

export function ProgressBar({ isAnimating }: {
  isAnimating: boolean
}) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
}
