export const Input = ({ type, value, onChange, className }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded p-2 w-full ${className}`}
    />
  );