import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe2, Shield, Coins, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ChainAnimation from "./ChainAnimation";
import Footer from "./footer";
import Header from "./header";

export default function Home() {
  const navigate = useNavigate();
  const handleStart = () => {
    if (sessionStorage.getItem("jwtToken")) {
      window.location.href = "/explore";
    } else {
      alert("Please login first");
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-cyan-700/20 rounded-full filter blur-3xl top-1/4 -left-48 animate-pulse-slow"></div>
          <div
            className="absolute w-96 h-96 bg-cyan-900/20 rounded-full filter blur-3xl bottom-1/4 -right-48 animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Spline Globe Container */}
        <div className="absolute inset-0 z-0 bg-gray-800/50">
          <div className="relative w-full h-full">
            <iframe
              src="https://my.spline.design/photorealearthanimationtoreveal-0e0bb45bbb3a2913405f072f3a84c559/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="relative"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                clipPath: "inset(0px 0px 60px 0px)", // Adjust the bottom value to hide the logo
              }}
            ></iframe>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-transparent bg-clip-text animate-float">
            Decentralizing the World, One Pin at a Time
          </h1>
          <p className="text-xl md:text-2xl text-cyan-100 mb-8">
            Activate, Verify, and Earn with DPIN infrastructure anywhere on the
            globe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 animate-glow">
              <Link onClick={handleStart}>Explore the Map</Link>
            </button>
            <button
              className="px-8 py-3 border border-cyan-600 rounded-full font-semibold hover:bg-cyan-600/10 transition-all duration-300 glass-effect"
              onClick={() => window.open("https://www.depins.io/", "_blank")}
            >
              Visit DePIN Store
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 bg-gray-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            What is dPINs?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe2 className="w-12 h-12 text-cyan-400" />,
                title: "Global Network",
                description:
                  "Connect and contribute to a worldwide decentralized infrastructure",
              },
              {
                icon: <Shield className="w-12 h-12 text-cyan-400" />,
                title: "Secure Infrastructure",
                description:
                  "Built on blockchain technology ensuring maximum security",
              },
              {
                icon: <Coins className="w-12 h-12 text-cyan-400" />,
                title: "Earn Rewards",
                description:
                  "Get compensated for your contributions to the network",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-effect p-8 rounded-2xl hover:bg-gray-700/50 transition-all duration-500 group hover:scale-105"
              >
                <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            How Does It Work?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Find a Pin Near You",
                desc: "Locate available pins on our interactive map",
              },
              {
                step: "2",
                title: "Complete Tasks",
                desc: "Follow instructions to activate the pin",
              },
              {
                step: "3",
                title: "Verify and Earn",
                desc: "Get rewards for successful activations",
              },
              {
                step: "4",
                title: "Redeem Points",
                desc: "Exchange points for stellar rewards",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="glass-effect h-[300px] p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-500 group hover:scale-105">
                  <div className="text-cyan-400 text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-500">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-cyan-500/50 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chain Animation */}
      <ChainAnimation />

      {/* Store Preview */}
      <section className="py-10 bg-gray-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            DePINS Store
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
                title: "IoT Device Kit",
                price: "$99",
                tokens: "100 Tokens",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
                title: "Advanced Antenna",
                price: "$199",
                tokens: "200 Tokens",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
                title: "Network Node",
                price: "$299",
                tokens: "300 Tokens",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-cyan-400">
                    {item.price} | {item.tokens}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-cyan-950 to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-1 gap-12 items-center text-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-transparent bg-clip-text">
                Start Building Decentralized Networks Today
              </h2>
              <p className="text-lg lg:text-xl text-cyan-100/80 mb-6">
                Join thousands of contributors worldwide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 lg:px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 animate-glow">
                  Sign Up for Free
                </button>
                <button className="px-6 lg:px-8 py-3 border border-cyan-600 rounded-full font-semibold hover:bg-cyan-600/10 transition-all duration-300 glass-effect">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
