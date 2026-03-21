export default function AboutPage() {
  return (
    <div className="min-h-screen bg-red-50">
      <div className="bg-red-700 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Bangalir Bajar</h1>
        <p className="text-red-200 text-lg">Hyderabad er Bengali community r jonno</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            Bangalir Bajar is a community directory built for the Bengali people of Hyderabad.
            We are home to over 4-5 lakh Bengalis — and yet, finding a trusted Bengali fish shop,
            a priest who knows your rituals, a tutor who speaks your language, or a caterer who
            makes real Bengali food has always depended on who you know.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            We built Bangalir Bajar to change that. One place. All of Hyderabad's Bengali
            businesses and service providers — searchable, trustworthy, and community-verified.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">What We Offer</h2>
          <div className="space-y-3">
            {[
              { icon: '🐟', text: 'Fish shops and Bengali food suppliers' },
              { icon: '🍬', text: 'Authentic sweets and catering services' },
              { icon: '🪔', text: 'Priests and puja service providers' },
              { icon: '📚', text: 'Bengali medium tutors and educators' },
              { icon: '🏠', text: 'Home services by trusted Bengali professionals' },
              { icon: '⚕️', text: 'Bengali doctors, lawyers and consultants' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">For Providers</h2>
          <p className="text-gray-700 leading-relaxed">
            Listing your business on Bangalir Bajar is completely free for the first two months.
            No commissions. No hidden charges. Just a clean, searchable profile that puts you
            in front of thousands of Bengali customers in Hyderabad who are actively looking
            for exactly what you offer.
          </p>
          <div className="mt-6">
            <a
              href="/onboard"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              List Your Business — Free
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have a question or want to get listed? Reach out to us directly.
          </p>
          <p className="text-gray-700 mt-2">
            We are a small Bengali team based in Hyderabad — always happy to help.
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="/"
              className="text-red-600 hover:underline text-sm font-medium"
            >
              Back to Directory
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}