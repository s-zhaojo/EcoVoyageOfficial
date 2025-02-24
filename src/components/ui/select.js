export const Select = ({ children, onValueChange, value, className }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border border-gray-300 rounded p-2 w-full ${className}`}
    >
      {children}
    </select>
  );
  
  export const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );