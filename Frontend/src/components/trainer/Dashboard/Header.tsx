const Header = () => (
  <div className="flex justify-between items-center mb-8 bg-[#1e1e1e]/70 p-4 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <h1 className="text-2xl font-semibold text-[#6366f1]">Dashboard</h1>
    <div className="flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#1e1e1e] transition-all">
      <span className="text-[#ffffff]">Alex Johnson</span>
      <img src="/api/placeholder/40/40" alt="User avatar" className="w-10 h-10 rounded-full border-2 border-[#6366f1] object-cover" />
    </div>
  </div>
);

export default Header;