import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-5 relative inline-block">
              Tahtib AlJuhd
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-pink-500"></span>
            </h3>
            <p className="text-slate-400">
              Your ultimate fitness companion for personalized workout plans and professional training.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-5 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-pink-500"></span>
            </h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-pink-500 transition-colors">Home</Link></li>
              <li><Link to="#features" className="hover:text-pink-500 transition-colors">Features</Link></li>
              <li><Link to="#user-types" className="hover:text-pink-500 transition-colors">For Whom</Link></li>
              <li><Link to="#how-it-works" className="hover:text-pink-500 transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-5 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-pink-500"></span>
            </h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-pink-500 transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-pink-500 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-pink-500 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-pink-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-5 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-pink-500"></span>
            </h3>
            <address className="not-italic space-y-2">
              <p>Email: info@tahtibaljuhd.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Fitness Street, Gym City</p>
            </address>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-800 text-center text-sm">
          <p>&copy; 2025 Tahtib AlJuhd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}