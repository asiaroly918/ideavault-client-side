import Link from 'next/link';
import { FaRocket, FaComments, FaChartLine, FaBrain, FaHeartbeat, FaGraduationCap, FaLeaf, FaBriefcase } from 'react-icons/fa';

const steps = [
  {
    icon: <FaRocket className="w-8 h-8" />,
    title: 'Share Your Idea',
    text: 'Post your startup concept with clear problem, solution, and target audience details.',
  },
  {
    icon: <FaComments className="w-8 h-8" />,
    title: 'Collect Feedback',
    text: 'Engage with founders, mentors, and enthusiasts through comments and discussions.',
  },
  {
    icon: <FaChartLine className="w-8 h-8" />,
    title: 'Iterate & Launch',
    text: 'Refine your pitch, validate assumptions, and turn feedback into a real business.',
  },
];

const categories = [
  { name: 'Tech', icon: <FaRocket />, color: 'bg-primary/10 text-primary' },
  { name: 'Health', icon: <FaHeartbeat />, color: 'bg-error/10 text-error' },
  { name: 'AI', icon: <FaBrain />, color: 'bg-secondary/10 text-secondary' },
  { name: 'Education', icon: <FaGraduationCap />, color: 'bg-accent/10 text-accent' },
  { name: 'Sustainability', icon: <FaLeaf />, color: 'bg-success/10 text-success' },
  { name: 'Business', icon: <FaBriefcase />, color: 'bg-warning/10 text-warning' },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How IdeaVault Works</h2>
          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            A simple three-step loop to take your idea from rough concept to community-validated venture.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                  {step.icon}
                </div>
                <h3 className="card-title text-xl">{step.title}</h3>
                <p className="text-base-content/70">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Explore by Category</h2>
          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            Find ideas that match your passion, expertise, or next investment thesis.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/ideas?category=${cat.name}`}
              className="group card bg-base-200 hover:bg-base-300 transition-colors border border-base-300"
            >
              <div className="card-body items-center text-center p-6">
                <div className={`p-3 rounded-full ${cat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
