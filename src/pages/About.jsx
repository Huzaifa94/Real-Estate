import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Real Estate</h1>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Real Estate, we strive to make the process of buying and selling homes simple and stress-free.
            Our mission is to provide clients with exceptional service, expert advice, and the best possible real estate solutions.
            Whether you're looking for your dream home or seeking to sell your property, we are here to help every step of the way.
          </p>
        </div>
        
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Real Estate is a team of experienced professionals who are passionate about helping individuals and families 
            find the perfect home. We pride ourselves on our extensive knowledge of the market, personalized service, 
            and commitment to our clients’ success. With years of experience, we ensure you get the best value for your investment.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
        <ul className="text-lg text-gray-600 list-disc list-inside">
          <li>Extensive local market knowledge</li>
          <li>Experienced agents with personalized services</li>
          <li>Expert advice on property investments</li>
          <li>Comprehensive support throughout the buying/selling process</li>
          <li>Commitment to achieving your real estate goals</li>
        </ul>
      </div>

    
    </div>
  )
}

export default About
