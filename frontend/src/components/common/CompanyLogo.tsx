import React from 'react';
import logoImg from '../../assets/logo.png';

export interface CompanyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  const shouldShowDetails = showSubtitle && showText;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Official AI SAMRAT Logo Graphic */}
      <img
        src={logoImg}
        alt="AI SAMRAT PRIVATE LIMITED"
        className={`${sizeClasses[size]} w-auto object-contain shrink-0`}
      />
      {shouldShowDetails && (
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 w-fit">
            ASSESSMENT HUB
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Enterprise Certification & Proctoring
          </span>
        </div>
      )}
    </div>
  );
};
