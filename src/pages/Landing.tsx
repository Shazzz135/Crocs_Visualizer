import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="bg-gradient-to-b from-green-600 to-green-900 min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-5xl text-center">
        <div className="mx-auto max-w-3xl">

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-white">Crocs-Visualizer</span>  
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white sm:text-lg sm:leading-8">
            Visualize your style with ease.
          </p>

          <button
            className="mt-8 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white
                       transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:bg-gray-800
                       active:scale-95 sm:px-8 sm:py-4 sm:text-base"
            onClick={() => {
              navigate('/workbench')
            }}
          >
            Get Started
          </button>
        </div>
      </section>
    </main>
  )
}