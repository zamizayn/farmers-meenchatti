
import React from 'react';

const HealthBenefits: React.FC = () => {
  const benefits = [
    { title: "Alkaline Property", desc: "Clay is alkaline in nature, which interacts with the acidity of the food and neutralizes the pH balance.", icon: "⚖️" },
    { title: "Oil Reduction", desc: "Clay pots are heat-resistant and slow-cooking allows food to retain its natural oils, requiring less added fat.", icon: "💧" },
    { title: "Mineral Rich", desc: "Cooking in clay adds essential minerals like calcium, phosphorus, iron, and magnesium to your diet.", icon: "💎" },
    { title: "Nutrient Retention", desc: "The porous nature of clay allows heat and moisture to circulate evenly, preserving 100% of nutrients.", icon: "🌿" }
  ];

  return (
    <section className="py-24 bg-sky-50/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-sky-700 font-bold uppercase tracking-[0.2em] text-sm">Wellness First</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Why Clay is Better for Your Body</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Traditional wisdom meets modern science. Cooking in clay isn't just about taste—it's a lifestyle choice for better digestion and health.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
              <img
                src="https://praguntatwa.com/wp-content/uploads/image-58.png"
                className="w-full h-full object-cover"
                alt="Seasoned Clay Pot"
              />
            </div>
            {/* Overlay card */}
            <div className="absolute -bottom-10 -left-10 bg-sky-700 text-white p-8 rounded-3xl shadow-2xl max-w-xs -rotate-3">
              <p className="text-2xl font-serif font-bold mb-2">100% Lead Free</p>
              <p className="text-sky-100 text-sm italic">Tested and certified for food safety and non-toxicity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthBenefits;
