// components/Logo.jsx
const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/uninotes_logo.png" 
      alt="UniNotes Logo" 
      className={className}
    />
  );
};

export default Logo;