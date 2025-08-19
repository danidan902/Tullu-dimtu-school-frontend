import { FaQuoteLeft } from "react-icons/fa";
import ScrollReveal from "../components/ScrollReveal";
import chairman from '../assets/principal2.jpg';
import Footer from "../components/Footer";
import schoolBgImage from '../assets/char.jpg'; 

function ChairmanWelcome() {
  return (
    <>
   
      <div className="relative h-[90vh] w-full overflow-hidden">
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{ backgroundImage: `url(${schoolBgImage})` }}
        >
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        
       
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Message from the <span className="text-yellow-300">Chairman</span>
              </h1>
              <div className="w-32 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-xl text-white/90 md:text-2xl max-w-3xl mx-auto">
                Leadership vision for academic excellence and student success
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>

      
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white -mt-20 relative z-20">
        <div className="container mx-auto px-6">
          <ScrollReveal delay={0.3}>
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="md:flex">
                
                <div className="md:w-2/5 bg-gradient-to-b from-blue-700 to-blue-900 flex items-center justify-center p-8">
                  <div className="relative w-48 h-48 rounded-full border-4 border-yellow-400 bg-gray-200 overflow-hidden shadow-lg">
                    <img 
                      src={chairman} 
                      alt="Chairman Tsegaye Mekuriya" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-12 h-12 rounded-full"></div>
                  </div>
                </div>
                
                
                <div className="md:w-3/5 p-8 md:p-10">
                  <div className="flex items-center mb-6">
                    <FaQuoteLeft className="text-yellow-500 mr-3 text-2xl" />
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Chairman's Message</h2>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    On behalf of the Board of Directors, I warmly welcome you to Tullu Dimtu Secondary School. 
                    Our institution stands as a beacon of academic excellence, committed to nurturing 
                    well-rounded individuals who will shape tomorrow's world.
                  </p>
                  
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    We take pride in our tradition of excellence while continuously innovating to meet 
                    the evolving needs of education in the 21st century. Our dedicated staff and 
                    world-class facilities ensure every student reaches their full potential.
                  </p>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <p className="font-bold text-blue-900 text-xl">Dr. Tsegaye Mekuriya</p>
                    <p className="text-gray-600">Chairman, Board of Directors</p>
                    <p className="text-sm text-gray-500 mt-1">Tullu Dimtu Secondary School</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ChairmanWelcome;