export const Card = ({ children }) => (
    <div className="border rounded-lg shadow-lg overflow-hidden">{children}</div>
  );
  
  export const CardContent = ({ children, className }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );