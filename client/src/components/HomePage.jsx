import Navbar from './Navbar'
import Welcome from './Welcome'

const HomePage = () => {
  return (
    <div className='gradient-bg-welcome min-h-[100vh]'>
        <Navbar />
        <Welcome />
    </div>
  )
}

export default HomePage
