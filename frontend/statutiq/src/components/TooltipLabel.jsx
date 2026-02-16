const TooltipLabel = ({ label, tooltip, required }) => {
  return (
    <label className="flex items-center gap-2 font-medium">
      {label}
      {required && <span className="text-red-600">*</span>}

      <div className="relative group cursor-pointer">
        {/* Icône info */}
        <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-100 transition">
          i
        </div>

        {/* Tooltip */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-gray-900 text-white text-xs rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20">
          {tooltip}
        </div>
      </div>
    </label>
  );
};

export default TooltipLabel;
