// import React, { Suspense } from 'react';
// import ExerciseAnimation from './sample2';

// function Sample() {
//   // Example: exerciseName could come from state, props, or an API
//   const exerciseName = 'Push Up'; // This could be dynamic, e.g., from user input
//   console.log('enterd to the dfjaklsdjfa')
//   return (
//     <div>
//       <Suspense fallback={<div>Loading...</div>}>
//         <ExerciseAnimation exerciseName={exerciseName} />
//       </Suspense>
//     </div>
//   );
// }

// export default Sample;


import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Sample = () => {
  const [dotLottie, setDotLottie] = React.useState(null);

  const dotLottieRefCallback = (dotLottie) => {
    setDotLottie(dotLottie);
  };

  function play(){
    if(dotLottie){
      dotLottie.play();
    }
  }

  function pause(){
    if(dotLottie){
      dotLottie.pause();
    }
  }

  function stop(){
    if(dotLottie){
      dotLottie.stop();
    }
  }

  function seek(){
    if(dotLottie){
      dotLottie.setFrame(30);
    }
  }

  return (
    <div>
      <DotLottieReact src="path/to/animation.lottie"
        loop
        autoplay
        dotLottieRefCallback={dotLottieRefCallback}
      />
      <div>
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={stop}>Stop</button>
        <button onClick={seek}>Seek to frame no. 30</button>
      </div>
    </div>
  );
};

export default Sample;