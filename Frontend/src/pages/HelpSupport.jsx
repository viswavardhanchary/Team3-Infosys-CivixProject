import React, { useEffect, useState } from "react";
import { userInfo } from "../axios/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const HelpSupport = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) {
      navigate("/login");
    } else {
      setData(userData.user);
      setFormData({
        ...formData,
        name: userData.user.name,
        email: userData.user.email,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const faqs = [
    {
      question: "What is Civix?",
      answer:
        "Civix is a civic engagement platform allowing users to create petitions, polls, and initiatives to drive social change.",
    },
    {
      question: "How do I create a petition?",
      answer:
        "Navigate to the Petitions section, click 'Create Petition', fill in the details, and submit for approval.",
    },
    {
      question: "Who can vote in polls?",
      answer:
        "Any registered Civix user can participate in active polls until they are closed by the creator or system.",
    },
    {
      question: "I forgot my password. What should I do?",
      answer:
        "Go to Login and click 'Forgot Password' to reset via email.",
    },
    {
      question: "How do I report a technical issue or bug?",
      answer:
        "Use the contact form below to describe your issue. Our support team will respond promptly.",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("we are woking on Helps and Support, thank u for ur paientence");
    setFormData({ ...formData, message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 bg-[#fdf3e7] text-gray-900 transition-all duration-300">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center text-[#8B5E34]">
          Help & Support
        </h1>
        <p className="text-[#A47148] text-center mb-10">
          Need assistance? Find answers to common questions or contact our
          support team directly.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#8B5E34] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-[#A47148] rounded-lg p-4 bg-[#fffaf3] hover:shadow-md transition-all duration-300"
              >
                <summary className="flex justify-between items-center cursor-pointer font-medium text-[#6F4E37]">
                  {faq.question}
                  <span className="text-[#A47148] group-open:rotate-180 transition-transform duration-300">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-[#A47148]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>


        <div className="border border-[#A47148] rounded-xl shadow-md p-6 md:p-8 bg-[#fffaf3]">
          <h2 className="text-2xl font-semibold text-[#8B5E34] mb-4">
            Contact Support
          </h2>
          <p className="text-[#A47148] mb-6">
            Still have questions or facing an issue? Fill out the form below, and
            our team will get back to you.
          </p>

          {submitted ? (
            <div className="bg-green-100 text-green-700 border border-green-300 p-4 rounded-lg">
              ✅ Thank you! Your message has been sent. Our support team will
              contact you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#6F4E37]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  disabled
                  value={data?.name || ""}
                  className="w-full border border-[#A47148] rounded-lg p-2 bg-gray-100 cursor-not-allowed opacity-70"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#6F4E37]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={data?.email || ""}
                  className="w-full border border-[#A47148] rounded-lg p-2 bg-gray-100 cursor-not-allowed opacity-70"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#6F4E37]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-[#A47148] rounded-lg p-2 focus:ring-2 focus:ring-[#8B5E34] outline-none bg-white"
                  placeholder="Describe your issue or question..."
                />
              </div>

              <button
                type="submit"
                className="bg-[#8B5E34] text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-[#6F4E37] transition-all duration-300"
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
