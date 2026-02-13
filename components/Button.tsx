import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-sage text-white shadow-lg shadow-sage/30 hover:bg-sage/90",
    secondary: "bg-charcoal text-white shadow-lg shadow-charcoal/30",
    outline: "border-2 border-sage text-sage hover:bg-sage/10",
    ghost: "text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
