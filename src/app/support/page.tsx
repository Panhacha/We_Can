import Link from 'next/link';

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unworn and unwashed items with tags attached. Please visit our returns portal to initiate a return."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within Cambodia. International shipping can take 7-14 business days depending on the destination."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide! Shipping costs will apply and will be added at checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive an email with a tracking number and a link to track your package."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, ABA Pay, and cash on delivery for local orders."
  }
];

export default function SupportPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-500">
            Find answers to common questions or reach out to our team.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-blue-50 rounded-2xl p-10 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            If you couldn't find the answer to your question, our support team is ready to assist you.
          </p>
          <Link href="/contact" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark transition-colors">
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}