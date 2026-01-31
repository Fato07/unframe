import Image from 'next/image'

export function CardsCodeanimation() {
  return (
  <div>
    <div className="absolute w-[180px] h-fit top-0 left-0 flex flex-row gap-2.5 justify-center items-center">
      <p className="absolute w-full h-fit">
        class Sampling(layers.Layer):    """Uses (mean, log_var) to sample z, the vector encoding a digit."""     def call(self, inputs):        mean, log_var = inputs        batch = tf.shape(mean)[0]        dim = tf.shape(mean)[1]        return mean + tf.exp(0.5 * log_var) * epsilon
      </p>
    </div>
    <div className="absolute w-[180px] h-fit top-0 left-[760px] flex flex-row gap-2.5 justify-center items-center">
    </div>
  </div>
  )
}
