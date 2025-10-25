import React, { useEffect, useState } from "react";
import { userInfo } from "../axios/user";
import { useNavigate } from "react-router-dom";

export const HelpSupport = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: data?.name,
    email: data?.email,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) {
      navigate('/login');
    } else {
      setData(userData.user);
    }
  }
  useEffect(() => {
    getUser();

  }, []);

  const faqs = [
    {
      question: "What is Civix?",
      answer:
        "Civix is a civic engagement platform that allows users to create petitions, polls, and initiatives to drive social change and connect with communities.",
    },
    {
      question: "How do I create a petition?",
      answer:
        "Once logged in, navigate to the Petitions section, click on 'Create Petition', fill in the details, and submit for approval.",
    },
    {
      question: "Who can vote in polls?",
      answer:
        "Any registered Civix user can participate in active polls until they are closed by the creator or automatically by system rules.",
    },
    {
      question: "I forgot my password. What should I do?",
      answer:
        "Go to the Login page and click on 'Forgot Password'. Follow the instructions to reset your password securely via email.",
    },
    {
      question: "How do I report a technical issue or bug?",
      answer:
        "You can use the contact form below to describe your issue. Our support team will respond as soon as possible.",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: data?.name, email: data?.email, message: "" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">
      <div className="max-w-4xl w-full">

        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3 text-center">
          Help & Support
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Need assistance? Find answers to common questions or contact our support team directly.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-300"
              >
                <summary className="flex justify-between items-center cursor-pointer text-blue-900 font-medium">
                  {faq.question}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform duration-300">
                    ▼
                  </span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>


        <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Contact Support
          </h2>
          <p className="text-gray-600 mb-6">
            Still have questions or facing an issue? Fill out the form below, and our team will get back to you.
          </p>

          {submitted ? (
            <div className="bg-green-100 text-green-700 border border-green-300 p-4 rounded-lg">
              ✅ Thank you! Your message has been sent. Our support team will contact you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  disabled={true}
                  value={data?data.name:"user"}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none cursor-not-allowed opacity-50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={true}
                  value={data?data.email:"mail"}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none cursor-not-allowed opacity-50"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Describe your issue or question..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
